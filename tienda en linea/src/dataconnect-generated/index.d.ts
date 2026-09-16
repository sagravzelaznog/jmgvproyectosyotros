import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

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

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;
export function createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface UpdateProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpdateProfileVariables): MutationRef<UpdateProfileData, UpdateProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: UpdateProfileVariables): MutationRef<UpdateProfileData, UpdateProfileVariables>;
  operationName: string;
}
export const updateProfileRef: UpdateProfileRef;

export function updateProfile(vars?: UpdateProfileVariables): MutationPromise<UpdateProfileData, UpdateProfileVariables>;
export function updateProfile(dc: DataConnect, vars?: UpdateProfileVariables): MutationPromise<UpdateProfileData, UpdateProfileVariables>;

interface DeleteUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<DeleteUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<DeleteUserData, undefined>;
  operationName: string;
}
export const deleteUserRef: DeleteUserRef;

export function deleteUser(): MutationPromise<DeleteUserData, undefined>;
export function deleteUser(dc: DataConnect): MutationPromise<DeleteUserData, undefined>;

interface GetMyProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyProfileData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyProfileData, undefined>;
  operationName: string;
}
export const getMyProfileRef: GetMyProfileRef;

export function getMyProfile(options?: ExecuteQueryOptions): QueryPromise<GetMyProfileData, undefined>;
export function getMyProfile(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyProfileData, undefined>;

interface ListUsersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUsersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListUsersData, undefined>;
  operationName: string;
}
export const listUsersRef: ListUsersRef;

export function listUsers(options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;
export function listUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;

interface CreateProductRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateProductVariables): MutationRef<CreateProductData, CreateProductVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateProductVariables): MutationRef<CreateProductData, CreateProductVariables>;
  operationName: string;
}
export const createProductRef: CreateProductRef;

export function createProduct(vars: CreateProductVariables): MutationPromise<CreateProductData, CreateProductVariables>;
export function createProduct(dc: DataConnect, vars: CreateProductVariables): MutationPromise<CreateProductData, CreateProductVariables>;

interface UpdateProductRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProductVariables): MutationRef<UpdateProductData, UpdateProductVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateProductVariables): MutationRef<UpdateProductData, UpdateProductVariables>;
  operationName: string;
}
export const updateProductRef: UpdateProductRef;

export function updateProduct(vars: UpdateProductVariables): MutationPromise<UpdateProductData, UpdateProductVariables>;
export function updateProduct(dc: DataConnect, vars: UpdateProductVariables): MutationPromise<UpdateProductData, UpdateProductVariables>;

interface DeleteProductRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteProductVariables): MutationRef<DeleteProductData, DeleteProductVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteProductVariables): MutationRef<DeleteProductData, DeleteProductVariables>;
  operationName: string;
}
export const deleteProductRef: DeleteProductRef;

export function deleteProduct(vars: DeleteProductVariables): MutationPromise<DeleteProductData, DeleteProductVariables>;
export function deleteProduct(dc: DataConnect, vars: DeleteProductVariables): MutationPromise<DeleteProductData, DeleteProductVariables>;

interface GetProductRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetProductVariables): QueryRef<GetProductData, GetProductVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetProductVariables): QueryRef<GetProductData, GetProductVariables>;
  operationName: string;
}
export const getProductRef: GetProductRef;

export function getProduct(vars: GetProductVariables, options?: ExecuteQueryOptions): QueryPromise<GetProductData, GetProductVariables>;
export function getProduct(dc: DataConnect, vars: GetProductVariables, options?: ExecuteQueryOptions): QueryPromise<GetProductData, GetProductVariables>;

interface ListProductsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListProductsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListProductsData, undefined>;
  operationName: string;
}
export const listProductsRef: ListProductsRef;

export function listProducts(options?: ExecuteQueryOptions): QueryPromise<ListProductsData, undefined>;
export function listProducts(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListProductsData, undefined>;

interface CreateOrderRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateOrderVariables): MutationRef<CreateOrderData, CreateOrderVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateOrderVariables): MutationRef<CreateOrderData, CreateOrderVariables>;
  operationName: string;
}
export const createOrderRef: CreateOrderRef;

export function createOrder(vars: CreateOrderVariables): MutationPromise<CreateOrderData, CreateOrderVariables>;
export function createOrder(dc: DataConnect, vars: CreateOrderVariables): MutationPromise<CreateOrderData, CreateOrderVariables>;

interface UpdateOrderStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateOrderStatusVariables): MutationRef<UpdateOrderStatusData, UpdateOrderStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateOrderStatusVariables): MutationRef<UpdateOrderStatusData, UpdateOrderStatusVariables>;
  operationName: string;
}
export const updateOrderStatusRef: UpdateOrderStatusRef;

export function updateOrderStatus(vars: UpdateOrderStatusVariables): MutationPromise<UpdateOrderStatusData, UpdateOrderStatusVariables>;
export function updateOrderStatus(dc: DataConnect, vars: UpdateOrderStatusVariables): MutationPromise<UpdateOrderStatusData, UpdateOrderStatusVariables>;

interface DeleteOrderRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteOrderVariables): MutationRef<DeleteOrderData, DeleteOrderVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteOrderVariables): MutationRef<DeleteOrderData, DeleteOrderVariables>;
  operationName: string;
}
export const deleteOrderRef: DeleteOrderRef;

export function deleteOrder(vars: DeleteOrderVariables): MutationPromise<DeleteOrderData, DeleteOrderVariables>;
export function deleteOrder(dc: DataConnect, vars: DeleteOrderVariables): MutationPromise<DeleteOrderData, DeleteOrderVariables>;

interface GetMyOrdersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyOrdersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyOrdersData, undefined>;
  operationName: string;
}
export const getMyOrdersRef: GetMyOrdersRef;

export function getMyOrders(options?: ExecuteQueryOptions): QueryPromise<GetMyOrdersData, undefined>;
export function getMyOrders(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyOrdersData, undefined>;

interface CreateOrderItemRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateOrderItemVariables): MutationRef<CreateOrderItemData, CreateOrderItemVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateOrderItemVariables): MutationRef<CreateOrderItemData, CreateOrderItemVariables>;
  operationName: string;
}
export const createOrderItemRef: CreateOrderItemRef;

export function createOrderItem(vars: CreateOrderItemVariables): MutationPromise<CreateOrderItemData, CreateOrderItemVariables>;
export function createOrderItem(dc: DataConnect, vars: CreateOrderItemVariables): MutationPromise<CreateOrderItemData, CreateOrderItemVariables>;

interface DeleteOrderItemRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteOrderItemVariables): MutationRef<DeleteOrderItemData, DeleteOrderItemVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteOrderItemVariables): MutationRef<DeleteOrderItemData, DeleteOrderItemVariables>;
  operationName: string;
}
export const deleteOrderItemRef: DeleteOrderItemRef;

export function deleteOrderItem(vars: DeleteOrderItemVariables): MutationPromise<DeleteOrderItemData, DeleteOrderItemVariables>;
export function deleteOrderItem(dc: DataConnect, vars: DeleteOrderItemVariables): MutationPromise<DeleteOrderItemData, DeleteOrderItemVariables>;

interface GetOrderItemsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrderItemsVariables): QueryRef<GetOrderItemsData, GetOrderItemsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetOrderItemsVariables): QueryRef<GetOrderItemsData, GetOrderItemsVariables>;
  operationName: string;
}
export const getOrderItemsRef: GetOrderItemsRef;

export function getOrderItems(vars: GetOrderItemsVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrderItemsData, GetOrderItemsVariables>;
export function getOrderItems(dc: DataConnect, vars: GetOrderItemsVariables, options?: ExecuteQueryOptions): QueryPromise<GetOrderItemsData, GetOrderItemsVariables>;

interface CreateReviewRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateReviewVariables): MutationRef<CreateReviewData, CreateReviewVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateReviewVariables): MutationRef<CreateReviewData, CreateReviewVariables>;
  operationName: string;
}
export const createReviewRef: CreateReviewRef;

export function createReview(vars: CreateReviewVariables): MutationPromise<CreateReviewData, CreateReviewVariables>;
export function createReview(dc: DataConnect, vars: CreateReviewVariables): MutationPromise<CreateReviewData, CreateReviewVariables>;

interface DeleteReviewRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteReviewVariables): MutationRef<DeleteReviewData, DeleteReviewVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteReviewVariables): MutationRef<DeleteReviewData, DeleteReviewVariables>;
  operationName: string;
}
export const deleteReviewRef: DeleteReviewRef;

export function deleteReview(vars: DeleteReviewVariables): MutationPromise<DeleteReviewData, DeleteReviewVariables>;
export function deleteReview(dc: DataConnect, vars: DeleteReviewVariables): MutationPromise<DeleteReviewData, DeleteReviewVariables>;

interface ListProductReviewsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListProductReviewsVariables): QueryRef<ListProductReviewsData, ListProductReviewsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListProductReviewsVariables): QueryRef<ListProductReviewsData, ListProductReviewsVariables>;
  operationName: string;
}
export const listProductReviewsRef: ListProductReviewsRef;

export function listProductReviews(vars: ListProductReviewsVariables, options?: ExecuteQueryOptions): QueryPromise<ListProductReviewsData, ListProductReviewsVariables>;
export function listProductReviews(dc: DataConnect, vars: ListProductReviewsVariables, options?: ExecuteQueryOptions): QueryPromise<ListProductReviewsData, ListProductReviewsVariables>;

