export function validateEmail(email: string): boolean {
    // Simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function validateName(firstName: string, lastName: string): boolean {
    // Only letters and numbers
    const nameRegex = /^[A-Za-z0-9]+$/;
    return nameRegex.test(firstName) && nameRegex.test(lastName);
}

export function validatePassword(password: string): boolean {
    // At least 9 chars, one letter, one number, one special char
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{9,}$/;
    return passwordRegex.test(password);
}

//generate ramdom avatar
export function assignRandomAvatar(): string {
    const avatars = [
        "https://i.pravatar.cc/150?img=1",
        "https://i.pravatar.cc/150?img=2",
        "https://i.pravatar.cc/150?img=3",
        "https://i.pravatar.cc/150?img=4",
        "https://i.pravatar.cc/150?img=5",
        "https://i.pravatar.cc/150?img=6",
        "https://i.pravatar.cc/150?img=7",
        "https://i.pravatar.cc/150?img=8",
        "https://i.pravatar.cc/150?img=9",
        "https://i.pravatar.cc/150?img=10",
        "https://i.pravatar.cc/150?img=11",
        "https://i.pravatar.cc/150?img=12",
        "https://i.pravatar.cc/150?img=13",
        "https://i.pravatar.cc/150?img=14",
        "https://i.pravatar.cc/150?img=15",
        "https://i.pravatar.cc/150?img=16",
        "https://i.pravatar.cc/150?img=17",
        "https://i.pravatar.cc/150?img=18",
        "https://i.pravatar.cc/150?img=19",
        "https://i.pravatar.cc/150?img=20",
    ];
      
    const randomIndex = Math.floor(Math.random() * avatars.length);
    return avatars[randomIndex];
}