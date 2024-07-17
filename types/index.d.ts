/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
	params: { [key: string]: string };
	searchParams: { [key: string]: string | string[] | undefined };
};

// ========================================

declare type SignUpParams = {
	accountType: string;
	firstName: string;
	lastName: string;
	phoneNumber: number;
	email: string;
	password: string;
};

declare type LoginUser = {
	email: string;
	password: string;
};

declare type User = {
	$id: string;
	email: string;
	userId: string;
	firstName: string;
	lastName: string;
	phoneNumber: number;
};

declare type NewUserParams = {
	userId: string;
	email: string;
	name: string;
	password: string;
};

declare type AccountTypes = 'individual' | 'e-commerce';

declare interface signInProps {
	email: string;
	password: string;
}


declare interface testimonyProp {
  name: string;
  content: string;
  designation: string;
  icon?: string;
}
