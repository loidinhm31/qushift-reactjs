import { Block, Button, MenuList, MenuListItem } from "konsta/react";
import { usePathname, useRouter } from "next/navigation";
import { TbSun } from "react-icons/tb";
import { IconType } from "react-icons/lib";

export interface MenuButtonOption {
  label: string;
  pathname: string;
  desc: string;
  icon: IconType;
}

export interface SideMenuProps {
  buttonOptions: MenuButtonOption[];
}

export function SideMenu(props: SideMenuProps) {
  const router = useRouter();
  const pathname = usePathname();

  const goToItem = (path) => {
    router.push(path);
  };

  return (
    <Block className="sticky top-0 sm:h-full">
      <MenuList>
        {props.buttonOptions.map((item, itemIndex) => (
          <MenuListItem
            key={`${item.label}-${itemIndex}`}
            onClick={() => goToItem(item.pathname)}
            active={item.pathname === pathname}
            title={item.label}
            media={<item.icon />}
          ></MenuListItem>
        ))}
      </MenuList>
      <Button>
        <TbSun className="w-6 h-6 p-1" />
        <span className="hidden lg:block">Dark Mode</span>
      </Button>
    </Block>
  );
}
