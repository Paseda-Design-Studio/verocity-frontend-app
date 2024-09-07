export default {};

declare global {
    /**
     * @description This interface is used to define the structure of search parameters for handling URL query parameters.
     * @interface SearchParamProps
     * @path types/ComponentTypes.d.ts
     * @note It is globally declared and used to ensure type safety for search parameters.
     */
    interface SearchParamProps {
        params: Record<string, string>;
        searchParams: Record<string, string | string[] | undefined>;
    }

    /**
     * @description This interface represents the structure of a testimonial object.
     * @interface testimonyProp
     * @path types/ComponentTypes.d.ts
     * @note It is globally declared for use in various components.
     */
    interface testimonyProp {
        name: string;
        content: string;
        designation: string;
        icon?: string;
    }

    /**
     * @description This type defines the possible account types.
     * @type AccountTypes
     * @path types/ComponentTypes.d.ts
     * @note It is globally declared to ensure type safety for account types.
     */
    type AccountTypes = 'individual' | 'e-commerce';

    /**
 * @description This interface defines the structure for component hero props.
 * @interface heroData
 * @path components/ComponentTypes.d.ts
 * @note This type is used to ensure type safety for the hero's props.
 */
    interface heroData {
        title: string;
        description: string;
        backgroundImage: string;
    }

}
