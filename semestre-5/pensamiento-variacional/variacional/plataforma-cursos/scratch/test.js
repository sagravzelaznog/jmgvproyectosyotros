function formatTerm(coeff, variable, isFirst) {
    if (coeff === 0) return "";
    let sign = coeff > 0 ? (isFirst ? "" : "+") : "-";
    let absCoeff = Math.abs(coeff);
    let coeffStr = absCoeff === 1 ? "" : absCoeff;
    return `${sign} ${coeffStr}${variable}`.trim();
}

function generateStepByStepHTML(sys) {
    // Eq1: a1*x + b1*y = c1
    // Eq2: a2*x + b2*y = c2
    
    // Paso 1: Despejar x de la Ecuación 1
    // a1*x = c1 - b1*y
    // x = (c1 - b1*y) / a1
    
    let step1 = `1. Despejamos $x$ de la primera ecuación:`;
    let eq1_orig = `${formatTerm(sys.a1, 'x', true)} ${formatTerm(sys.b1, 'y', false)} = ${sys.c1}`;
    let eq1_step1 = `${formatTerm(sys.a1, 'x', true)} = ${sys.c1} ${formatTerm(-sys.b1, 'y', false)}`;
    
    let x_expr;
    if (sys.a1 === 1) {
        x_expr = `${sys.c1} ${formatTerm(-sys.b1, 'y', false)}`;
    } else if (sys.a1 === -1) {
        x_expr = `${-sys.c1} ${formatTerm(sys.b1, 'y', false)}`;
    } else {
        x_expr = `\\frac{${sys.c1} ${formatTerm(-sys.b1, 'y', false)}}{${sys.a1}}`;
    }
    
    let step1_math = `$$ \\begin{aligned} ${eq1_orig} \\\\ ${eq1_step1} \\\\ x &= ${x_expr} \\end{aligned} $$`;

    // Paso 2: Sustituimos x en la Ecuación 2
    let step2 = `2. Sustituimos $x$ en la segunda ecuación y resolvemos para $y$:`;
    let eq2_orig = `${formatTerm(sys.a2, 'x', true)} ${formatTerm(sys.b2, 'y', false)} = ${sys.c2}`;
    
    // a2 * (x_expr) + b2*y = c2
    let subst_expr = sys.a1 === 1 || sys.a1 === -1 ? `(${x_expr})` : `\\left( ${x_expr} \\right)`;
    let eq2_subst = `${sys.a2}${subst_expr} ${formatTerm(sys.b2, 'y', false)} = ${sys.c2}`;
    
    let step2_math = `$$ \\begin{aligned} ${eq2_orig} \\\\ ${eq2_subst} \\\\ `;
    
    // resolver para y ... (simplificado para no hacer tantos pasos algebraicos complejos en render)
    // Mostramos el resultado de y
    step2_math += `y &= ${sys.y} \\end{aligned} $$`;

    // Paso 3: Sustituir y en x
    let step3 = `3. Sustituimos el valor de $y$ en la ecuación despejada de $x$:`;
    let step3_math = `$$ \\begin{aligned} x &= ${x_expr.replace('y', `(${sys.y})`)} \\\\ x &= ${sys.x} \\end{aligned} $$`;

    return `
        <div class="text-left text-slate-700 text-sm md:text-base space-y-4">
            <div>
                <p>${step1}</p>
                ${step1_math}
            </div>
            <div>
                <p>${step2}</p>
                ${step2_math}
            </div>
            <div>
                <p>${step3}</p>
                ${step3_math}
            </div>
            <div class="font-bold text-center text-lg mt-4 text-indigo-700">
                Solución: $x = ${sys.x} \\quad ; \\quad y = ${sys.y}$
            </div>
        </div>
    `;
}

console.log(generateStepByStepHTML({a1: 2, b1: -3, c1: -1, a2: 1, b2: 2, c2: 3, x: 1, y: 1}));
