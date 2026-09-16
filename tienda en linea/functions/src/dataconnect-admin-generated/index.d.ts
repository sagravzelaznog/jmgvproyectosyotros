import { ConnectorConfig, DataConnect, OperationOptions, ExecuteOperationResponse } from 'firebase-admin/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export interface CreateOrderData {
  order: Order_Key;
}

export interface CreateOrderItemData {
  orderItem_insert: OrderItem_Key;
}

export interface CreateOrderItemVariables {
  orderId: UUIDString;
  productId: UUIDString;
  quantity: number;
  price: number;
}

export interface CreateOrderVariables {
  totalAmount: number;
}

export interface CreateProductData {
  product_insert: Product_Key;
}

export interface CreateProductVariables {
  name: string;
  price: number;
  thickness: number;
  description?: string | null;
  imageUrl?: string | null;
  category?: string | null;
}

export interface CreateReviewData {
  review_insert: Review_Key;
}

export interface CreateReviewVariables {
  productId: UUIDString;
  rating: number;
  comment?: string | null;
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface CreateUserVariables {
  email: string;
  name?: string | null;
  phoneNumber?: string | null;
}

export interface DeleteOrderData {
  order_delete?: Order_Key | null;
}

export interface DeleteOrderItemData {
  orderItem_delete?: OrderItem_Key | null;
}

export interface DeleteOrderItemVariables {
  id: UUIDString;
}

export interface DeleteOrderVariables {
  id: UUIDString;
}

export interface DeleteProductData {
  product_delete?: Product_Key | null;
}

export interface DeleteProductVariables {
  id: UUIDString;
}

export interface DeleteReviewData {
  review_delete?: Review_Key | null;
}

export interface DeleteReviewVariables {
  id: UUIDString;
}

export interface DeleteUserData {
  user_delete?: User_Key | null;
}

export interface GetMyOrdersData {
  orders: ({
    id: UUIDString;
    status: string;
    totalAmount: number;
    createdAt: TimestampString;
  } & Order_Key)[];
}

export interface GetMyProfileData {
  user?: {
    email: string;
    name?: string | null;
    phoneNumber?: string | null;
    role: string;
  };
}

export interface GetOrderItemsData {
  orderItems: ({
    product: {
      name: string;
    };
    quantity: number;
    priceAtPurchase: number;
  })[];
}

export interface GetOrderItemsVariables {
  orderId: UUIDString;
}

export interface GetProductData {
  product?: {
    name: string;
    price: number;
    description?: string | null;
    imageUrl?: string | null;
  };
}

export interface GetProductVariables {
  id: UUIDString;
}

export interface ListProductReviewsData {
  reviews: ({
    rating: number;
    comment?: string | null;
    user: {
      name?: string | null;
    };
  })[];
}

export interface ListProductReviewsVariables {
  productId: UUIDString;
}

export interface ListProductsData {
  products: ({
    id: UUIDString;
    name: string;
    price: number;
    category?: string | null;
  } & Product_Key)[];
}

export interface ListUsersData {
  users: ({
    email: string;
    name?: string | null;
    phoneNumber?: string | null;
  })[];
}

export interface OrderItem_Key {
  id: UUIDString;
  __typename?: 'OrderItem_Key';
}

export interface Order_Key {
  id: UUIDString;
  __typename?: 'Order_Key';
}

export interface Product_Key {
  id: UUIDString;
  __typename?: 'Product_Key';
}

export interface Review_Key {
  id: UUIDString;
  __typename?: 'Review_Key';
}

export interface UpdateOrderStatusData {
  order_update?: Order_Key | null;
}

export interface UpdateOrderStatusVariables {
  id: UUIDString;
  status: string;
}

export interface UpdateProductData {
  product_update?: Product_Key | null;
}

export interface UpdateProductVariables {
  id: UUIDString;
  price?: number | null;
}

export interface UpdateProfileData {
  user_update?: User_Key | null;
}

export interface UpdateProfileVariables {
  name?: string | null;
  phoneNumber?: string | null;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

/** Generated Node Admin SDK operation action function for the 'CreateUser' Mutation. Allow users to execute without passing in DataConnect. */
export function createUser(dc: DataConnect, vars: CreateUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateUserData>>;
/** Generated Node Admin SDK operation action function for the 'CreateUser' Mutation. Allow users to pass in custom DataConnect instances. */
export function createUser(vars: CreateUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateUserData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateProfile' Mutation. Allow users to execute without passing in DataConnect. */
export function updateProfile(dc: DataConnect, vars?: UpdateProfileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateProfileData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateProfile' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateProfile(vars?: UpdateProfileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateProfileData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteUser' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteUser(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteUserData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteUser' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteUser(options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteUserData>>;

/** Generated Node Admin SDK operation action function for the 'GetMyProfile' Query. Allow users to execute without passing in DataConnect. */
export function getMyProfile(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<GetMyProfileData>>;
/** Generated Node Admin SDK operation action function for the 'GetMyProfile' Query. Allow users to pass in custom DataConnect instances. */
export function getMyProfile(options?: OperationOptions): Promise<ExecuteOperationResponse<GetMyProfileData>>;

/** Generated Node Admin SDK operation action function for the 'ListUsers' Query. Allow users to execute without passing in DataConnect. */
export function listUsers(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListUsersData>>;
/** Generated Node Admin SDK operation action function for the 'ListUsers' Query. Allow users to pass in custom DataConnect instances. */
export function listUsers(options?: OperationOptions): Promise<ExecuteOperationResponse<ListUsersData>>;

/** Generated Node Admin SDK operation action function for the 'CreateProduct' Mutation. Allow users to execute without passing in DataConnect. */
export function createProduct(dc: DataConnect, vars: CreateProductVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateProductData>>;
/** Generated Node Admin SDK operation action function for the 'CreateProduct' Mutation. Allow users to pass in custom DataConnect instances. */
export function createProduct(vars: CreateProductVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateProductData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateProduct' Mutation. Allow users to execute without passing in DataConnect. */
export function updateProduct(dc: DataConnect, vars: UpdateProductVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateProductData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateProduct' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateProduct(vars: UpdateProductVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateProductData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteProduct' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteProduct(dc: DataConnect, vars: DeleteProductVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteProductData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteProduct' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteProduct(vars: DeleteProductVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteProductData>>;

/** Generated Node Admin SDK operation action function for the 'GetProduct' Query. Allow users to execute without passing in DataConnect. */
export function getProduct(dc: DataConnect, vars: GetProductVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetProductData>>;
/** Generated Node Admin SDK operation action function for the 'GetProduct' Query. Allow users to pass in custom DataConnect instances. */
export function getProduct(vars: GetProductVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetProductData>>;

/** Generated Node Admin SDK operation action function for the 'ListProducts' Query. Allow users to execute without passing in DataConnect. */
export function listProducts(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListProductsData>>;
/** Generated Node Admin SDK operation action function for the 'ListProducts' Query. Allow users to pass in custom DataConnect instances. */
export function listProducts(options?: OperationOptions): Promise<ExecuteOperationResponse<ListProductsData>>;

/** Generated Node Admin SDK operation action function for the 'CreateOrder' Mutation. Allow users to execute without passing in DataConnect. */
export function createOrder(dc: DataConnect, vars: CreateOrderVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateOrderData>>;
/** Generated Node Admin SDK operation action function for the 'CreateOrder' Mutation. Allow users to pass in custom DataConnect instances. */
export function createOrder(vars: CreateOrderVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateOrderData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateOrderStatus' Mutation. Allow users to execute without passing in DataConnect. */
export function updateOrderStatus(dc: DataConnect, vars: UpdateOrderStatusVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateOrderStatusData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateOrderStatus' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateOrderStatus(vars: UpdateOrderStatusVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateOrderStatusData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteOrder' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteOrder(dc: DataConnect, vars: DeleteOrderVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteOrderData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteOrder' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteOrder(vars: DeleteOrderVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteOrderData>>;

/** Generated Node Admin SDK operation action function for the 'GetMyOrders' Query. Allow users to execute without passing in DataConnect. */
export function getMyOrders(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<GetMyOrdersData>>;
/** Generated Node Admin SDK operation action function for the 'GetMyOrders' Query. Allow users to pass in custom DataConnect instances. */
export function getMyOrders(options?: OperationOptions): Promise<ExecuteOperationResponse<GetMyOrdersData>>;

/** Generated Node Admin SDK operation action function for the 'CreateOrderItem' Mutation. Allow users to execute without passing in DataConnect. */
export function createOrderItem(dc: DataConnect, vars: CreateOrderItemVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateOrderItemData>>;
/** Generated Node Admin SDK operation action function for the 'CreateOrderItem' Mutation. Allow users to pass in custom DataConnect instances. */
export function createOrderItem(vars: CreateOrderItemVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateOrderItemData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteOrderItem' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteOrderItem(dc: DataConnect, vars: DeleteOrderItemVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteOrderItemData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteOrderItem' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteOrderItem(vars: DeleteOrderItemVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteOrderItemData>>;

/** Generated Node Admin SDK operation action function for the 'GetOrderItems' Query. Allow users to execute without passing in DataConnect. */
export function getOrderItems(dc: DataConnect, vars: GetOrderItemsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetOrderItemsData>>;
/** Generated Node Admin SDK operation action function for the 'GetOrderItems' Query. Allow users to pass in custom DataConnect instances. */
export function getOrderItems(vars: GetOrderItemsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetOrderItemsData>>;

/** Generated Node Admin SDK operation action function for the 'CreateReview' Mutation. Allow users to execute without passing in DataConnect. */
export function createReview(dc: DataConnect, vars: CreateReviewVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateReviewData>>;
/** Generated Node Admin SDK operation action function for the 'CreateReview' Mutation. Allow users to pass in custom DataConnect instances. */
export function createReview(vars: CreateReviewVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateReviewData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteReview' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteReview(dc: DataConnect, vars: DeleteReviewVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteReviewData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteReview' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteReview(vars: DeleteReviewVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteReviewData>>;

/** Generated Node Admin SDK operation action function for the 'ListProductReviews' Query. Allow users to execute without passing in DataConnect. */
export function listProductReviews(dc: DataConnect, vars: ListProductReviewsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListProductReviewsData>>;
/** Generated Node Admin SDK operation action function for the 'ListProductReviews' Query. Allow users to pass in custom DataConnect instances. */
export function listProductReviews(vars: ListProductReviewsVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListProductReviewsData>>;

