
export type UserStatus = "active" | "inactive" | "banned";
export type Role = "admin" | "editor" | "viewer";

export interface Address {
    street: string;
    city: string;
    zipCode: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    role: Role;
    status: UserStatus;
    address?: Address; 
}

export interface Product {
    id: string;
    name: string;
    price: number;
    inStock: boolean;
}

export interface Order {
    orderId: string;
    userId: string;
    items: Product[];
    totalAmount: number;
    createdAt: Date;
}

export function getUserById(users: User[], id: string): User | undefined {
    return users.find((user: User) => user.id === id);
}

export function updateUserStatus(user: User, newStatus: UserStatus): User {
    return {
        ...user,
        status: newStatus
    };
}

export function calculateOrderTotal(products: Product[]): number {
    return products.reduce((total: number, product: Product) => {
        return total + (product.inStock ? product.price : 0);
    }, 0);
}

export function createOrder(user: User, products: Product[]): Order {
    if (user.status !== "active") {
        throw new Error(`Cannot create order: User is ${user.status}`);
    }

    const availableProducts: Product[] = products.filter((p: Product) => p.inStock);
    
    return {
        orderId: `ORD-${Date.now()}`,
        userId: user.id,
        items: availableProducts,
        totalAmount: calculateOrderTotal(availableProducts),
        createdAt: new Date()
    };
}


const mockUsers: User[] = [
    {
        id: "U1",
        username: "alice_smith",
        email: "alice@example.com",
        role: "admin",
        status: "active",
        address: { street: "123 Main St", city: "New York", zipCode: "10001" }
    },
    {
        id: "U2",
        username: "bob_jones",
        email: "bob@example.com",
        role: "viewer",
        status: "inactive"
    }
];

const mockProducts: Product[] = [
    { id: "P1", name: "Laptop", price: 1200, inStock: true },
    { id: "P2", name: "Mouse", price: 25, inStock: true },
    { id: "P3", name: "Keyboard", price: 100, inStock: false }, // Out of stock
];

console.log("--- Testing Strict TS Module ---");

const activeUser: User | undefined = getUserById(mockUsers, "U1");
if (activeUser) {
    console.log(`\nFound user: ${activeUser.username}`);
    
    try {
        const order: Order = createOrder(activeUser, mockProducts);
        console.log("Order Created Successfully:");
        console.log(`Order ID: ${order.orderId}, Total: $${order.totalAmount}`);
        console.log(`Items included: ${order.items.map(i => i.name).join(", ")}`);
    } catch (e: unknown) {
        if (e instanceof Error) console.error(e.message);
    }
}

const inactiveUser: User | undefined = getUserById(mockUsers, "U2");
if (inactiveUser) {
    console.log(`\nFound user: ${inactiveUser.username} (Status: ${inactiveUser.status})`);
    
    try {
        console.log("Attempting to create order...");
        createOrder(inactiveUser, mockProducts);
    } catch (e: unknown) {
         if (e instanceof Error) console.error(`Caught Expected Error: ${e.message}`);
    }
    
    const updatedUser: User = updateUserStatus(inactiveUser, "active");
    console.log(`User status safely updated to: ${updatedUser.status}`);
}
