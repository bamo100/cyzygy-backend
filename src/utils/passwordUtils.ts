import bcrypt from "bcryptjs";

// Hash a password
export const hashPassword: (password: string) => Promise<string> = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

export async function handleNonAdminPassword(userData: {
    role: string;
    lastName: string;
    password?: string;
}) {
    if (userData.role === 'user' && userData.lastName) {
        const hashed = await bcrypt.hash(userData.lastName, 10);
        userData.password = hashed;
    }
    // lastName remains unchanged
    return userData;
}