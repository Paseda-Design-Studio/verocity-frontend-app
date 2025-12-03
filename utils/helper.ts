export const carouselResponsiveOptions = [
	{
		breakpoint: '1400px',
		numVisible: 1,
		numScroll: 1,
	},
	{
		breakpoint: '1199px',
		numVisible: 1,
		numScroll: 1,
	},
	{
		breakpoint: '767px',
		numVisible: 1,
		numScroll: 1,
	},
	{
		breakpoint: '575px',
		numVisible: 1,
		numScroll: 1,
	},
];

export const sidebarLinks = [
	{
		icon: 'dashboard', 
		route: '/admin/dashboard',
		label: 'Dashboard',
	},
	{
		icon: 'lorry',
		route: '/admin/tracking',
		label: 'Tracking',
	},
	{
		icon: 'management',
		route: '/admin/shipment',
		label: 'Shipment Management',
	},
	{
		icon: 'people', 
		route: '/admin/customers',
		label: 'Customers',
	},
	{
		icon: 'setting',
		route: '/admin/settings',
		label: 'Settings',
	},
];

export const tabSettingsLinks = [
	{
		route: '/admin/settings',
		label: 'Profile',
	},
	{
		route: '/admin/settings/admin',
		label: 'Admin',
	},
	{
		route: '/admin/settings/notifications',
		label: 'Notifications',
	},
	{
		route: '/admin/settings/logs',
		label: 'Logs',
	},
];

export const formatAmount = (amount: number) => {
	const formatter = new Intl.NumberFormat('en-NG', {
		style: 'currency',
		currency: 'NGN',
		minimumFractionDigits: 2,
	});

	return formatter.format(amount);
};

// capitalize first letter of a string
export const capitalizeFirstLetter = (str: string) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

// For a single country (both operational and all countries)
export interface Country {
  code: string;        // e.g. "GH"
  dial_code: string;   // e.g. "+233"
  flag: string;        // e.g. "🇬🇭"
  name: string;        // e.g. "Ghana"
  location_type?: string; // e.g. "regions" or "states"
  locations?: Location[];    // Optional array of states/regions for the country
}

// For the API response structure
export interface CountriesResponse {
 countries: Country[]; // Array of Country objects	
}

// For a single state/region
export interface Location {
  code: string;        // e.g. "Greater Accra Region"
  name: string;        // e.g. "Greater Accra Region"
  type?: string;       // e.g. "region" or "state"
  cities?: string[];   // Optional array of cities in this location
}

// For cities API response
export interface CitiesResponse {
    cities: string[];
    country_code: string;
    location: string;
}
