import {
	Box,
	Link,
	Menu,
	MenuButton,
	MenuDivider,
	MenuGroup,
	MenuItem,
	MenuList,
	Text,
	useColorModeValue
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useTranslation } from "next-i18next";
import React, { ElementType } from "react";
import { FiLayout, FiSettings } from "react-icons/fi";

interface MenuOption {
	name: string;
	href: string;
	desc: string;
	icon: ElementType;
	isExternal: boolean;
}

export function UserMenu() {
	const { t } = useTranslation();
	const borderColor = useColorModeValue("gray.300", "gray.600");

	const options: MenuOption[] = [
		{
			name: t("dashboard"),
			href: "/dashboard",
			desc: t("dashboard"),
			icon: FiLayout,
			isExternal: false
		},
		{
			name: t("account_settings"),
			href: "/account",
			desc: t("account_settings"),
			icon: FiSettings,
			isExternal: false
		}
	];


	return (
		<Menu>
			<MenuButton border="solid" borderRadius="full" borderWidth="thin" borderColor={borderColor}>
				<Box display="flex" alignItems="center" gap="3" p="1" paddingRight={[1, 1, 1, 6, 6]}>
					<Text data-cy="username" className="hidden lg:flex">
					</Text>
				</Box>
			</MenuButton>
			<MenuList p="2" borderRadius="xl" shadow="none">
				<Box display="flex" flexDirection="column" alignItems="center" borderRadius="md" p="4">

				</Box>
				<MenuDivider />
				<MenuGroup>
					{options.map((item) => (
						<Link
							key={item.name}
							as={item.isExternal ? "a" : NextLink}
							isExternal={item.isExternal}
							href={item.href}
							_hover={{ textDecoration: "none" }}
						>
							<MenuItem gap="3" borderRadius="md" p="4">
								<item.icon className="text-blue-500" aria-hidden="true" />
								<Text>{item.name}</Text>
							</MenuItem>
						</Link>
					))}
				</MenuGroup>
				<MenuDivider />

			</MenuList>
		</Menu>
	);
}

export default UserMenu;
