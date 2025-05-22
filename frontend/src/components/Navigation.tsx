"use client";

import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import InboxIcon from "@mui/icons-material/Inbox";
import SyncIcon from "@mui/icons-material/Sync";
import { useRouter } from "next/navigation";

const Navigation = ({ children }: { children: React.ReactNode }) => {
  const drawerWidth = 240;
  const [selectedMenu, setSelectedMenu] = useState("Home");
  const listMenu = [
    {
      name: "Home",
      icon: <HomeIcon />,
      path: "/home",
    },
    {
      name: "History",
      icon: <InboxIcon />,
      path: "/history",
    },
    {
      name: "Switch to user",
      icon: <SyncIcon />,
      path: "/user",
    },
  ];
  const router = useRouter();

  const handleClickMenu = (menu: string, path: string) => {
    setSelectedMenu(menu);
    router.push(path);
  };

  return (
    <Box display="flex">
      <Drawer
        variant="permanent"
        sx={{
          with: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Box
          sx={{
            padding: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              padding: 2,
            }}
          >
            Admin
          </Typography>
          <List>
            {listMenu.map((menu) => (
              <ListItemButton
                key={menu.name}
                selected={selectedMenu === menu.name}
                onClick={() => handleClickMenu(menu.name, menu.path)}
              >
                <ListItemIcon>{menu.icon}</ListItemIcon>
                <ListItemText primary={menu.name} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: `${drawerWidth}px`, // สำคัญมาก!
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Navigation;
