export default {};

declare global {
    /**
     * @description This interface represents the structure of a user object.
     * @interface User
     * @path types/UserTypes.d.ts
     * @note This interface is globally declared to standardize user data.
     */
    interface User {
        $id: string;
        email: string;
        userId: string;
        firstName: string;
        lastName: string;
        phoneNumber: number;
    }

    /**
     * @description This interface defines the structure of parameters required to create a new user.
     * @interface NewUserParams
     * @path types/UserTypes.d.ts
     * @note This interface is globally declared for new user creation.
     */
    interface NewUserParams {
        userId: string;
        email: string;
        name: string;
        password: string;
    }
}
