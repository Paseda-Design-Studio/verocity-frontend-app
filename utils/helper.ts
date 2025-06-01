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
		imgURL: '/icons/dashboard.svg',
		route: '/admin/dashboard',
		label: 'Dashboard',
	},
	{
		imgURL: '/icons/tracking.svg',
		route: '/admin/tracking',
		label: 'Tracking',
	},
	{
		imgURL: '/icons/shipment.svg',
		route: '/admin/shipment',
		label: 'Shipment Management',
	},
	{
		imgURL: '/icons/customer.svg',
		route: '/admin/customers',
		label: 'Customers',
	},
	{
		imgURL: '/icons/setting.svg',
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
  locations?: Location[];    // Optional array of states for the country
}

// For the API response structure
export interface CountriesResponse {
 countries: Country[]; // Array of Country objects	
}

// For a single state
export interface Location {
  code: string;        // e.g. "AA"
  name: string;        // e.g. "Greater Accra"
}