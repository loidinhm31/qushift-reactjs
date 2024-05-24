import { Link, Navbar, Page, Panel } from "konsta/react";
import React, { useState } from "react";

import { Header } from "@/components/Header";
import { MenuButtonOption, SideMenu } from "@/components/SideMenu";

interface SideMenuLayoutProps {
  menuButtonOptions: MenuButtonOption[];
  children: React.ReactNode;
}

export const SideMenuLayout = (props: SideMenuLayoutProps) => {
  const [leftPanelOpened, setLeftPanelOpened] = useState(false);

  return (
    <Page>
      <Header setLeftPanelOpened={setLeftPanelOpened} />
      <Panel side="left" opened={leftPanelOpened} onBackdropClick={() => setLeftPanelOpened(false)}>
        <Page>
          <Navbar
            title="QuShift"
            right={
              <Link navbar onClick={() => setLeftPanelOpened(false)}>
                Close
              </Link>
            }
          />
          <div className="space-y-4">
            <SideMenu buttonOptions={props.menuButtonOptions} />
          </div>
        </Page>
      </Panel>

      <div>{props.children}</div>
    </Page>
  );
};
