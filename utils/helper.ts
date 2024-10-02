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
