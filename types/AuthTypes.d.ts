export default {};

declare global {
    /**
     * @description This interface defines the structure for user registration parameters.
     * @interface SignUpParams
     * @path types/AuthTypes.d.ts
     * @note This type is globally declared.
     */
    interface SignUpParams {
        accountType: string;
        firstName: string;
        lastName: string;
        phoneNumber: number;
        email: string;
        password: string;
    }

    /**
     * @description This interface defines the structure for user login parameters.
     * @interface LoginUser
     * @path types/AuthTypes.d.ts
     * @note This type is globally declared.
     */
    interface LoginUser {
        email: string;
        password: string;
    }
    
    /**
     * @description This interface defines the structure for sign-in parameters.
     * @interface signInProps
     * @path types/AuthTypes.d.ts
     * @note This type is globally declared.
     */
    interface signInProps {
        email: string;
        password: string;
    }
}
