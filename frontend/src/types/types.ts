//ERROR
export type ApiError = {
  data: {
    msg: string;
  };
};
//REUSABLE
export type MessageRes = {
  msg: string;
};

type Client = {
  _id: string;
  fullName: string;
  userId: string;
  profilePicture: string;
};
type Trainer = {
  _id: string;
  fullName: string;
  userId: string;
  profilePicture: string;
};

export type User = {
  _id: string;
  userId: string;
  fullName: string;
  email: string;
  role: string;
  package: { _id: string; name: string };
  membershipExpDate: Date;
  note: string;
  profilePicture: string;
  createdAt: Date;
  updatedAt: Date;
  clients?: Client[] | [];
  trainer?: string | Trainer | null;
  active?: boolean;
};
export type CurrentUser = {
  _id: string;
  fullName: string;
  email: string;
  userId: string;
  role: string;
};
//AUTH
export type CurrentUserRes = {
  currentUser: CurrentUser;
};

export type LoginArg = {
  email: string;
  password: string;
};

export type LoginRes = {
  msg: string;
  tokenUser: CurrentUser;
};

export type AuthStateType = {
  currentUser: CurrentUser | null;
};

//ADMIN
export type getAllUsersRes = {
  page: number;
  limit: number;
  totalUsers: number;
  totalPages: number;
  nextPage: number | null;
  users: User[];
};

export type getAllUsersArg = {
  page?: number;
  fullName?: string;
  role?: string;
  gymPackage?: string;
  active?: boolean;
};

export type RegisterUserArgs = {
  fullName: string;
  email: string;
  role?: string;
  password?: string;
};
export type UpdateUserArgs = {
  id: string;
  data: {
    fullName?: string;
    email?: string;
    role?: string;
    note?: string;
  };
};
//USER
export type UpdateInfo = {
  fullName?: string;
  email?: string;
  profilePicture?: string;
};

export type UpdatePassword = {
  newPassword: string;
  confirmNewPassword: string;
  oldPassword: string;
};
//UPLOAD
export type UploadRes = {
  msg: string;
  url: string;
};
// STAFF
export type RegisterMemberRes = {
  msg: string;
  fullName: string;
  email: string;
  userId: string;
};
export type RegisterMemberArg = {
  fullName: string;
  email: string;
  gymPackage: string;
};

export type GetSingleMemberRes = {
  member: User;
};
export type CheckMembershipRes = {
  member: User;
  isActive: boolean;
  membershipExpDate: string;
  package: {
    _id: string;
    name: string;
  };
  msg: string;
};
export type RenewMembershipRes = {
  msg: string;
  newExpirationDate: string;
  package: string;
};
export type RenewMembershipArg = {
  id: string;
  gymPackage: string;
};

export type UpdateMemberArg = {
  fullName: string;
  email: string;
  note: string;
  id: string;
};

// PACKAGE
export type Package = {
  _id: string;
  name: string;
  price: number;
  duration: number;
  isActive: boolean;
};

export type CreatePackageArg = {
  name: string;
  price: number;
  duration: number;
};

export type UpdatePackageArg = {
  id: string;
  data: {
    name?: string;
    price?: number;
    duration?: number;
    isActive?: boolean;
  };
};
// PRODUCTS

export type Product = {
  _id: string;
  productId: number;
  name: string;
  countInStock: number;
  image: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
};

export type getAllProductsRes = {
  currentPage: number;
  totalPages: number;
  nextPage: number | null;
  prevPage: number | null;
  totalProducts: number;
  products: Product[];
};

export type getAllProductsArg = {
  page?: number;
  name?: string;
  priceGte?: number;
  priceLte?: number;
};

export type CreateProductArg = {
  name: string;
  image: string;
  price: number;
  countInStock: number;
};

export type UpdateProductArg = {
  id: string;
  data: {
    name?: string;
    image?: string;
    price?: number;
    countInStock?: number;
  };
};

//PAYMENTS
//-package
export type PackagePayment = {
  _id: string;
  member: {
    _id: string;
    fullName: string;
    email: string;
    userId: string;
  };
  package: {
    _id: string;
    name: string;
    price: number;
    duration: number;
  };
  price: number;
  createdAt: Date;
  updatedAt: Date;
};

export type AllPPaymentsRes = {
  currentPage: number;
  totalPages: number;
  nextPage: number | null;
  prevPage: number | null;
  totalPayments: number;
  payments: PackagePayment[];
};

export type AllPPaymentsArg = {
  page?: number;
};

export type GetSinglePackageRevenueRes = {
  packageId: string;
  totalRevenue: number;
  totalPayments: number;
};

export type TotalPackagesRevenue = {
  totalRevenue: number;
  totalPayments: number;
};
// -products

export type ProdPayment = {
  _id: string;
  items: { product: string; quantity: number; _id: string }[];
  totalPrice: number;
  workingStaffMember: { _id: string; fullName: string; userId: string };
  createdAt: Date;
  updatedAt: Date;
};

export type AllProdRes = {
  page?: number;
};

export type AllProductPaymentRes = {
  nextPage: number | null;
  totalPages: number;
  totalItems: number;
  payments: ProdPayment[];
};

export type CreateProductPayArg = {
  items: { product: string; quantity: number }[];
  totalPrice: number;
};

export type CreProdPayRes = {
  msg: string;
  paymentId: string;
};

export type GetSingleProductPayRes = {
  payment: {
    _id: string;
    items: { product: Product; quantity: number }[];
    totalPrice: number;
    workingStaffMember: { _id: string; fullName: string; userId: string };
    createdAt: Date;
    updatedAt: Date;
  };
};

export type TotalRevenueRes = {
  totalRevenue: number;
  totalPayments: number;
};

// TRAINER
export type GetAllClientsRes = {
  clients: User[];
  page: number;
  totalClients: number;
  totalPages: number;
  nextPage: number | null;
};
// CHATS
type BasicInfo = {
  _id: string;
  profilePicture: string;
  userId: string;
  fullName: string;
};

export type Chat = {
  _id: string;
  trainerId: BasicInfo;
  memberId: BasicInfo;
  messages: Message[] | [];
  lastMessage: Message | undefined;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateChatRes = {
  msg: string;
  chat: Chat;
};

export type GetAllChatsRes = {
  chats: Chat[];
};

export type GetChatMessagesRes = {
  messages: PopulatedMessage[];
};

// MESSAGES
export type Message = {
  senderId: { fullName: string; userId: string; _id: string };
  chatId: string;
  text: string;
  status: "seen" | "sent";
  _id: string;
};

export type PopulatedMessage = {
  senderId: { _id: string; fullName: string; email: string; userId: string };
  chatId: string;
  text: string;
  status: string;
  createdAt: Date;
  _id: string;
};
