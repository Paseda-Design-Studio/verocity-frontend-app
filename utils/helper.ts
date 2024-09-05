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
		route: '/dashboard',
		label: 'Dashboard',
	},
	{
		imgURL: '/icons/tracking.svg',
		route: '/tracking',
		label: 'Tracking',
	},
	{
		imgURL: '/icons/shipment.svg',
		route: '/shipment',
		label: 'Shipment Management',
	},
	{
		imgURL: '/icons/customer.svg',
		route: '/customer',
		label: 'Customer',
	},
	{
		imgURL: '/icons/setting.svg',
		route: '/setting',
		label: 'Settings',
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
