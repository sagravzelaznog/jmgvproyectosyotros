import os
import yfinance as yf
import pandas as pd
import numpy as np
import json
from flask import Flask, jsonify, render_template, request, send_from_directory
from ta.trend import MACD, EMAIndicator, ADXIndicator
from ta.momentum import RSIIndicator, StochasticOscillator
from ta.volatility import BollingerBands, AverageTrueRange
from ta.volume import VolumeWeightedAveragePrice
from datetime import datetime, timedelta
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from pathlib import Path
import time

app = Flask(__name__)

# Configuration
INDICES = {
    'US100': {'symbol': '^NDX', 'name': 'Nasdaq 100'},
    'US30': {'symbol': '^DJI', 'name': 'Dow Jones Industrial Average'},
    'US500': {'symbol': '^GSPC', 'name': 'S&P 500'}
}

# Create directories if they don't exist
os.makedirs('static/plots', exist_ok=True)
os.makedirs('data/analysis', exist_ok=True)

# Technical Analysis Settings
RSI_OVERBOUGHT = 70
RSI_OVERSOLD = 30
MACD_SIGNAL = 0

class MarketAnalyzer:
    def __init__(self, symbol, period='1y', interval='1d'):
        self.symbol = symbol
        self.period = period
        self.interval = interval
        self.df = None
        self.analysis = {}
        self.chart_paths = {}
        self.indicators = {}
        self.timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')

    def fetch_data(self):
        """Fetch historical market data"""
        ticker = yf.Ticker(self.symbol)
        self.df = ticker.history(period=self.period, interval=self.interval)
        return self.df is not None and not self.df.empty

    def analyze(self):
        """Perform technical analysis"""
        if self.df is None or self.df.empty:
            return False

        try:
            # Calculate indicators
            # RSI
            rsi = RSIIndicator(close=self.df['Close'], window=14)
            self.df['RSI'] = rsi.rsi()
            
            # MACD
            macd = MACD(close=self.df['Close'])
            self.df['MACD'] = macd.macd()
            self.df['MACD_signal'] = macd.macd_signal()
            self.df['MACD_hist'] = macd.macd_diff()
            
            # Moving Averages
            self.df['EMA20'] = EMAIndicator(close=self.df['Close'], window=20).ema_indicator()
            self.df['EMA50'] = EMAIndicator(close=self.df['Close'], window=50).ema_indicator()
            self.df['EMA200'] = EMAIndicator(close=self.df['Close'], window=200).ema_indicator()
            
            # Bollinger Bands
            bb = BollingerBands(close=self.df['Close'], window=20, window_dev=2)
            self.df['BB_upper'] = bb.bollinger_hband()
            self.df['BB_lower'] = bb.bollinger_lband()
            self.df['BB_middle'] = bb.bollinger_mavg()
            
            # Additional Indicators
            # ATR
            atr = AverageTrueRange(high=self.df['High'], low=self.df['Low'], 
                                 close=self.df['Close'], window=14)
            self.df['ATR'] = atr.average_true_range()
            
            # Stochastic Oscillator
            stoch = StochasticOscillator(high=self.df['High'], low=self.df['Low'], 
                                       close=self.df['Close'], window=14, smooth_window=3)
            self.df['STOCH_K'] = stoch.stoch()
            self.df['STOCH_D'] = stoch.stoch_signal()
            
            # ADX
            adx = ADXIndicator(high=self.df['High'], low=self.df['Low'], 
                             close=self.df['Close'], window=14)
            self.df['ADX'] = adx.adx()
            self.df['ADX_POS'] = adx.adx_pos()
            self.df['ADX_NEG'] = adx.adx_neg()
            
            # VWAP (for daily or higher timeframes)
            if '1d' in self.interval or '1wk' in self.interval or '1mo' in self.interval:
                vwap = VolumeWeightedAveragePrice(high=self.df['High'], low=self.df['Low'],
                                               close=self.df['Close'], volume=self.df['Volume'], window=20)
                self.df['VWAP'] = vwap.volume_weighted_average_price()
            
            # Store indicator values for the latest period
            self.indicators = {
                'rsi': round(self.df['RSI'].iloc[-1], 2),
                'macd': round(self.df['MACD'].iloc[-1], 2),
                'macd_signal': round(self.df['MACD_signal'].iloc[-1], 2),
                'macd_hist': round(self.df['MACD_hist'].iloc[-1], 2),
                'ema20': round(self.df['EMA20'].iloc[-1], 2),
                'ema50': round(self.df['EMA50'].iloc[-1], 2),
                'ema200': round(self.df.get('EMA200', 0).iloc[-1], 2) if 'EMA200' in self.df.columns else None,
                'bb_upper': round(self.df['BB_upper'].iloc[-1], 2),
                'bb_middle': round(self.df['BB_middle'].iloc[-1], 2),
                'bb_lower': round(self.df['BB_lower'].iloc[-1], 2),
                'atr': round(self.df['ATR'].iloc[-1], 2),
                'stoch_k': round(self.df['STOCH_K'].iloc[-1], 2),
                'stoch_d': round(self.df['STOCH_D'].iloc[-1], 2),
                'adx': round(self.df['ADX'].iloc[-1], 2),
                'adx_pos': round(self.df['ADX_POS'].iloc[-1], 2),
                'adx_neg': round(self.df['ADX_NEG'].iloc[-1], 2),
                'vwap': round(self.df.get('VWAP', 0).iloc[-1], 2) if 'VWAP' in self.df.columns else None,
                'price': round(self.df['Close'].iloc[-1], 2),
                'volume': int(self.df['Volume'].iloc[-1])
            }
            
            # Generate charts
            self._generate_charts()
            # Save analysis data
            self._save_analysis()
            
            return True
            
        except Exception as e:
            print(f"Error in analyze: {str(e)}")
            return False

    def _generate_charts(self):
        """Generate interactive charts for the analysis"""
        if self.df is None or self.df.empty:
            return
            
        try:
            # Create subplots
            fig = make_subplots(
                rows=4, cols=1, 
                shared_xaxes=True, 
                vertical_spacing=0.03,
                row_heights=[0.5, 0.15, 0.15, 0.2],
                subplot_titles=(
                    'Precio y Medias Móviles', 
                    'RSI', 
                    'MACD',
                    'Volumen'
                )
            )
            
            # Add candlestick
            fig.add_trace(
                go.Candlestick(
                    x=self.df.index,
                    open=self.df['Open'],
                    high=self.df['High'],
                    low=self.df['Low'],
                    close=self.df['Close'],
                    name='Precio',
                    showlegend=False
                ),
                row=1, col=1
            )
            
            # Add Bollinger Bands
            fig.add_trace(
                go.Scatter(
                    x=self.df.index,
                    y=self.df['BB_upper'],
                    line=dict(color='rgba(200, 200, 200, 0.5)'),
                    name='BB Upper',
                    showlegend=False
                ),
                row=1, col=1
            )
            
            fig.add_trace(
                go.Scatter(
                    x=self.df.index,
                    y=self.df['BB_middle'],
                    line=dict(color='rgba(100, 100, 100, 0.5)'),
                    name='BB Middle',
                    showlegend=False
                ),
                row=1, col=1
            )
            
            fig.add_trace(
                go.Scatter(
                    x=self.df.index,
                    y=self.df['BB_lower'],
                    line=dict(color='rgba(200, 200, 200, 0.5)'),
                    fill='tonexty',
                    fillcolor='rgba(200, 200, 200, 0.1)',
                    name='BB Lower',
                    showlegend=False
                ),
                row=1, col=1
            )
            
            # Add EMAs
            fig.add_trace(
                go.Scatter(
                    x=self.df.index,
                    y=self.df['EMA20'],
                    line=dict(color='blue', width=1),
                    name='EMA 20',
                    showlegend=True
                ),
                row=1, col=1
            )
            
            fig.add_trace(
                go.Scatter(
                    x=self.df.index,
                    y=self.df['EMA50'],
                    line=dict(color='orange', width=1.5),
                    name='EMA 50',
                    showlegend=True
                ),
                row=1, col=1
            )
            
            if 'EMA200' in self.df.columns:
                fig.add_trace(
                    go.Scatter(
                        x=self.df.index,
                        y=self.df['EMA200'],
                        line=dict(color='red', width=2),
                        name='EMA 200',
                        showlegend=True
                    ),
                    row=1, col=1
                )
            
            # Add VWAP if available
            if 'VWAP' in self.df.columns:
                fig.add_trace(
                    go.Scatter(
                        x=self.df.index,
                        y=self.df['VWAP'],
                        line=dict(color='purple', width=1.5, dash='dash'),
                        name='VWAP',
                        showlegend=True
                    ),
                    row=1, col=1
                )
            
            # Add RSI
            fig.add_trace(
                go.Scatter(
                    x=self.df.index,
                    y=self.df['RSI'],
                    line=dict(color='blue', width=1.5),
                    name='RSI',
                    showlegend=False
                ),
                row=2, col=1
            )
            
            # Add RSI levels
            fig.add_hline(y=70, line_dash="dash", line_color="red", row=2, col=1, opacity=0.3)
            fig.add_hline(y=30, line_dash="dash", line_color="green", row=2, col=1, opacity=0.3)
            
            # Add MACD
            colors = ['green' if val >= 0 else 'red' for val in self.df['MACD_hist']]
            
            fig.add_trace(
                go.Bar(
                    x=self.df.index,
                    y=self.df['MACD_hist'],
                    marker_color=colors,
                    name='MACD Hist',
                    showlegend=False
                ),
                row=3, col=1
            )
            
            fig.add_trace(
                go.Scatter(
                    x=self.df.index,
                    y=self.df['MACD'],
                    line=dict(color='blue', width=1.5),
                    name='MACD',
                    showlegend=False
                ),
                row=3, col=1
            )
            
            fig.add_trace(
                go.Scatter(
                    x=self.df.index,
                    y=self.df['MACD_signal'],
                    line=dict(color='red', width=1.5),
                    name='Signal',
                    showlegend=False
                ),
                row=3, col=1
            )
            
            # Add Volume
            colors_volume = ['green' if row['Open'] - row['Close'] >= 0 
                           else 'red' for _, row in self.df.iterrows()]
            
            fig.add_trace(
                go.Bar(
                    x=self.df.index,
                    y=self.df['Volume'],
                    marker_color=colors_volume,
                    name='Volumen',
                    showlegend=False
                ),
                row=4, col=1
            )
            
            # Update layout
            fig.update_layout(
                title=f"{self.symbol} - Análisis Técnico",
                height=1200,
                hovermode='x unified',
                template='plotly_dark',
                xaxis_rangeslider_visible=False,
                showlegend=True,
                legend=dict(
                    orientation="h",
                    yanchor="bottom",
                    y=1.02,
                    xanchor="right",
                    x=1
                )
            )
            
            # Update y-axes titles
            fig.update_yaxes(title_text="Precio", row=1, col=1)
            fig.update_yaxes(title_text="RSI", row=2, col=1, range=[0, 100])
            fig.update_yaxes(title_text="MACD", row=3, col=1)
            fig.update_yaxes(title_text="Volumen", row=4, col=1)
            
            # Save the chart with full HTML
            chart_path = f"static/plots/{self.symbol}_{self.timestamp}.html"
            # Add custom HTML template with the specific Plotly version
            html_template = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8" />
                <script src="https://cdn.plot.ly/plotly-2.24.1.min.js" integrity="sha512-5l2s3b5sPfCffYUKdgWBi0f6hXYSzaKwWMJUZPsua8j7RzHtCQjm3pP2t3CkyoIt7gXqyhLJdBpXhQ1Mxz03Yg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
                <style>
                    .plotly-graph-div {{
                        width: 100%;
                        height: 100%;
                    }}
                    body, html {{
                        margin: 0;
                        padding: 0;
                        width: 100%;
                        height: 100%;
                    }}
                </style>
            </head>
            <body>
                <div id="plotly-chart"></div>
                <script>
                    var plotData = {plotly_json};
                    Plotly.newPlot('plotly-chart', plotData.data, plotData.layout, {{responsive: true}});
                </script>
            </body>
            </html>
            """
            
            # Save the chart with our custom template
            with open(chart_path, 'w', encoding='utf-8') as f:
                f.write(html_template.format(
                    plotly_json=fig.to_json()
                ))
            self.chart_paths['main'] = chart_path
            
            # Generate indicator-specific charts
            self._generate_indicator_charts()
            
        except Exception as e:
            print(f"Error generating charts: {str(e)}")
    
    def _generate_indicator_charts(self):
        """Generate additional charts for specific indicators"""
        try:
            # ADX Chart
            fig_adx = go.Figure()
            
            fig_adx.add_trace(
                go.Scatter(
                    x=self.df.index,
                    y=self.df['ADX'],
                    line=dict(color='blue', width=2),
                    name='ADX'
                )
            )
            
            fig_adx.add_trace(
                go.Scatter(
                    x=self.df.index,
                    y=self.df['ADX_POS'],
                    line=dict(color='green', width=1),
                    name='+DI'
                )
            )
            
            fig_adx.add_trace(
                go.Scatter(
                    x=self.df.index,
                    y=self.df['ADX_NEG'],
                    line=dict(color='red', width=1),
                    name='-DI'
                )
            )
            
            fig_adx.update_layout(
                title=f"{self.symbol} - ADX",
                template='plotly_dark',
                showlegend=True,
                height=400,
                margin=dict(t=40, b=40, l=40, r=40)
            )
            
            adx_path = f"static/plots/{self.symbol}_adx_{self.timestamp}.html"
            # Save ADX chart with our custom template
            html_template_adx = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8" />
                <script src="https://cdn.plot.ly/plotly-2.24.1.min.js" integrity="sha512-5l2s3b5sPfCffYUKdgWBi0f6hXYSzaKwWMJUZPsua8j7RzHtCQjm3pP2t3CkyoIt7gXqyhLJdBpXhQ1Mxz03Yg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
                <style>
                    .plotly-graph-div {{
                        width: 100%;
                        height: 100%;
                    }}
                    body, html {{
                        margin: 0;
                        padding: 0;
                        width: 100%;
                        height: 100%;
                    }}
                </style>
            </head>
            <body>
                <div id="plotly-chart"></div>
                <script>
                    var plotData = {fig_adx.to_json()};
                    Plotly.newPlot('plotly-chart', plotData.data, plotData.layout, {{responsive: true}});
                </script>
            </body>
            </html>
            """
            with open(adx_path, 'w', encoding='utf-8') as f:
                f.write(html_template_adx)
            self.chart_paths['adx'] = adx_path
            
            # Stochastic Oscillator Chart
            fig_stoch = go.Figure()
            
            fig_stoch.add_trace(
                go.Scatter(
                    x=self.df.index,
                    y=self.df['STOCH_K'],
                    line=dict(color='blue', width=1.5),
                    name='%K'
                )
            )
            
            fig_stoch.add_trace(
                go.Scatter(
                    x=self.df.index,
                    y=self.df['STOCH_D'],
                    line=dict(color='red', width=1.5),
                    name='%D'
                )
            )
            
            # Add overbought/oversold lines
            fig_stoch.add_hline(y=80, line_dash="dash", line_color="red", opacity=0.3)
            fig_stoch.add_hline(y=20, line_dash="dash", line_color="green", opacity=0.3)
            
            fig_stoch.update_layout(
                title=f"{self.symbol} - Estocástico",
                template='plotly_dark',
                showlegend=True,
                height=400,
                margin=dict(t=40, b=40, l=40, r=40),
                yaxis=dict(range=[0, 100])
            )
            
            stoch_path = f"static/plots/{self.symbol}_stoch_{self.timestamp}.html"
            # Save Stochastic chart with our custom template
            html_template_stoch = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8" />
                <script src="https://cdn.plot.ly/plotly-2.24.1.min.js" integrity="sha512-5l2s3b5sPfCffYUKdgWBi0f6hXYSzaKwWMJUZPsua8j7RzHtCQjm3pP2t3CkyoIt7gXqyhLJdBpXhQ1Mxz03Yg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
                <style>
                    .plotly-graph-div {{
                        width: 100%;
                        height: 100%;
                    }}
                    body, html {{
                        margin: 0;
                        padding: 0;
                        width: 100%;
                        height: 100%;
                    }}
                </style>
            </head>
            <body>
                <div id="plotly-chart"></div>
                <script>
                    var plotData = {fig_stoch.to_json()};
                    Plotly.newPlot('plotly-chart', plotData.data, plotData.layout, {{responsive: true}});
                </script>
            </body>
            </html>
            """
            with open(stoch_path, 'w', encoding='utf-8') as f:
                f.write(html_template_stoch)
            self.chart_paths['stoch'] = stoch_path
            
        except Exception as e:
            print(f"Error generating indicator charts: {str(e)}")
    
    def _save_analysis(self):
        """Save the analysis data to a JSON file"""
        try:
            analysis_data = {
                'symbol': self.symbol,
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'interval': self.interval,
                'indicators': self.indicators,
                'chart_paths': self.chart_paths,
                'signals': self.generate_signals()
            }
            
            # Create filename with symbol and timestamp
            filename = f"data/analysis/{self.symbol}_{self.timestamp}.json"
            
            # Save to file
            with open(filename, 'w') as f:
                json.dump(analysis_data, f, indent=4)
                
        except Exception as e:
            print(f"Error saving analysis: {str(e)}")
            
    def generate_signals(self):
        """Generate trading signals based on technical analysis"""
        if self.df is None or self.df.empty:
            return {}

        # Get the latest data point
        latest = self.df.iloc[-1]
        
        # Initialize signal strength (0-100%)
        buy_signal = 0
        sell_signal = 0
        sell_signal = 0
        
        # RSI Signals
        rsi = latest['RSI']
        if rsi < RSI_OVERSOLD:
            buy_signal += 30
        elif rsi > RSI_OVERBOUGHT:
            sell_signal += 30
            
        # MACD Signals
        if latest['MACD'] > latest['MACD_signal'] and self.df['MACD'].iloc[-2] <= self.df['MACD_signal'].iloc[-2]:
            buy_signal += 20  # MACD line crosses above signal line
        elif latest['MACD'] < latest['MACD_signal'] and self.df['MACD'].iloc[-2] >= self.df['MACD_signal'].iloc[-2]:
            sell_signal += 20  # MACD line crosses below signal line
        
        # Moving Average Crossover
        if latest['EMA20'] > latest['EMA50'] and self.df['EMA20'].iloc[-2] <= self.df['EMA50'].iloc[-2]:
            buy_signal += 25  # Golden cross
        elif latest['EMA20'] < latest['EMA50'] and self.df['EMA20'].iloc[-2] >= self.df['EMA50'].iloc[-2]:
            sell_signal += 25  # Death cross
        
        # Price relative to Bollinger Bands 
        if latest['Close'] < latest['BB_lower']:
            buy_signal += 25  # Price below lower band (oversold)
        elif latest['Close'] > latest['BB_upper']:
            sell_signal += 25  # Price above upper band (overbought)
        
        # Ensure signals don't exceed 100%
        buy_signal = min(100, buy_signal)
        sell_signal = min(100, sell_signal)
        
        return {
            'symbol': self.symbol,
            'price': round(latest['Close'], 2),
            'buy_signal': buy_signal,
            'sell_signal': sell_signal,
            'rsi': round(latest['RSI'], 2),
            'macd': round(latest['MACD'], 2),
            'macd_signal': round(latest['MACD_signal'], 2),
            'timestamp': latest.name.strftime('%Y-%m-%d %H:%M:%S')
        }

    def get_analysis(self):
        """Run complete analysis"""
        if not self.fetch_data():
            return None
        
        if not self.analyze():
            return None
            
        return self.generate_signals()

def check_alerts(signals, threshold=70):
    """Check if any signals exceed the alert threshold"""
    alerts = []
    for signal in signals:
        if signal['buy_signal'] >= threshold:
            alerts.append({
                'symbol': signal['symbol'],
                'type': 'BUY',
                'strength': signal['buy_signal'],
                'price': signal['price']
            })
        if signal['sell_signal'] >= threshold:
            alerts.append({
                'symbol': signal['symbol'],
                'type': 'SELL',
                'strength': signal['sell_signal'],
                'price': signal['price']
            })
    return alerts

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/analyze')
def analyze():
    signals = []
    alerts = []
    
    for name, data in INDICES.items():
        analyzer = MarketAnalyzer(data['symbol'])
        signal = analyzer.get_analysis()
        if signal:
            signal['name'] = name
            signal['display_name'] = data['name']
            signals.append(signal)
    
    alerts = check_alerts(signals)
    
    return jsonify({
        'status': 'success',
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'signals': signals,
        'alerts': alerts
    })

@app.route('/api/analyze/<symbol>')
def analyze_symbol(symbol):
    if symbol.upper() not in INDICES:
        return jsonify({'status': 'error', 'message': 'Invalid symbol'}), 400
    
    data = INDICES[symbol.upper()]
    analyzer = MarketAnalyzer(data['symbol'])
    signal = analyzer.get_analysis()
    
    if not signal:
        return jsonify({'status': 'error', 'message': 'Failed to analyze symbol'}), 500
    
    signal['name'] = symbol.upper()
    signal['display_name'] = data['name']
    alerts = check_alerts([signal])
    
    # Add chart paths to response
    response = {
        'status': 'success',
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'signal': signal,
        'alerts': alerts,
        'charts': analyzer.chart_paths,
        'indicators': analyzer.indicators
    }
    
    return jsonify(response)

@app.route('/chart/<path:filename>')
def serve_chart(filename):
    return send_from_directory('static/plots', filename)

if __name__ == '__main__':
    os.makedirs('static/plots', exist_ok=True)
    app.run(debug=True, port=5000)
