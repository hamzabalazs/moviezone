import {
  AppBar,
  Avatar,
  Button,
  IconButton,
  Link,
  ListItemIcon,
  Menu,
  MenuItem,
  Switch,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VideocamIcon from "@mui/icons-material/Videocam";
import Logout from "@mui/icons-material/Logout";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import { useApiContext } from "../api/ApiContext";
import { themeSwitchContext } from "../themeSwitchContext";

export default function NavigationBar() {
  const context = useApiContext();
  const currUser = context.user;
  const [userRole, setUserRole] = useState<"admin" | "editor" | "viewer">(
    "viewer"
  );
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    context.logOut();
    navigate("/login");
  };

  const handleAccountNav = () => {
    navigate("/account");
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorLang, setAnchorLang] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const openLang = Boolean(anchorLang);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClickLang = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorLang(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCloseLang = () => {
    setAnchorLang(null);
  };

  const handleChangeLangToEn = () => {
    i18n.changeLanguage("en");
    localStorage.setItem("lang", "en");
  };

  const handleChangeLangtoHu = () => {
    i18n.changeLanguage("hu");
    localStorage.setItem("lang", "hu");
  };

  const handleRole = () => {
    if (currUser) {
      if (currUser.role === "admin") setUserRole("admin");
      else if (currUser.role === "editor") setUserRole("editor");
      else setUserRole("viewer");
    }
  };

  useEffect(() => {
    if (currUser) {
      setFirstName(currUser.first_name);
      setLastName(currUser.last_name);
      handleRole();
    }
  }, []);

  return (
    <Suspense fallback="Loading...">
      <AppBar
        position="relative"
        sx={{ backgroundColor: "primary.dark" }}
        data-testid="navbarcomponent"
      >
        <Toolbar id="back-to-top-anchor">
          {userRole === "admin" && (
            <>
              <IconButton href="/">
                <VideocamIcon
                  sx={{ fontSize: 40 }}
                  data-testid="navbar-home-icon"
                />
              </IconButton>
              <Link
                href="/"
                underline="none"
                variant="h6"
                sx={{ color: "text.primary", marginLeft: 1 }}
                data-testid="navbar-home-link"
              >
                MovieZone
              </Link>
              <Link
                href="/categories"
                underline="none"
                variant="h6"
                sx={{ color: "text.primary", marginLeft: 4 }}
                data-testid="navbar-categories-link"
              >
                {t("navbar.Categories")}
              </Link>
              <Link
                href="/users"
                underline="none"
                variant="h6"
                sx={{ color: "text.primary", marginLeft: 4, flexGrow: 1 }}
                data-testid="navbar-users-link"
              >
                {t("navbar.Users")}
              </Link>
            </>
          )}
          {userRole === "editor" && (
            <>
              <IconButton href="/">
                <VideocamIcon
                  sx={{ fontSize: 40 }}
                  data-testid="navbar-home-icon"
                />
              </IconButton>
              <Link
                href="/"
                underline="none"
                variant="h6"
                sx={{ color: "text.primary" }}
                data-testid="navbar-home-link"
              >
                MovieZone
              </Link>
              <Link
                href="/categories"
                underline="none"
                variant="h6"
                sx={{ color: "text.primary", marginLeft: 4, flexGrow: 1 }}
                data-testid="navbar-categories-link"
              >
                {t("navbar.Categories")}
              </Link>
            </>
          )}
          {userRole === "viewer" && (
            <>
              <IconButton href="/" data-testid="navbar-home-icon">
                <VideocamIcon sx={{ fontSize: 40 }} />
              </IconButton>
              <Link
                href="/"
                underline="none"
                variant="h6"
                sx={{ color: "text.primary" }}
                data-testid="navbar-home-link"
              >
                MovieZone
              </Link>
              <Link
                href="/reviews"
                underline="none"
                variant="h6"
                sx={{ color: "text.primary", marginLeft: 4, flexGrow: 1 }}
                data-testid="navbar-myreviews-link"
              >
                {t("navbar.myReviews")}
              </Link>
            </>
          )}
          <Button
            onClick={handleClickLang}
            sx={{ color: "text.primary" }}
            data-testid="navbar-language-menu"
          >
            {t("navbar.Language")}
          </Button>
          <Menu
            anchorEl={anchorLang}
            id="lang-menu"
            open={openLang}
            onClose={handleCloseLang}
            onClick={handleCloseLang}
          >
            <MenuItem
              onClick={handleChangeLangToEn}
              data-testid="navbar-language-en"
            >
              <img
                src="https://flagcdn.com/w20/gb.png"
                width="20"
                alt="United Kingdom"
                style={{ marginRight: 3 }}
              />
              <Typography> {t("navbar.English")}</Typography>
            </MenuItem>
            <MenuItem
              onClick={handleChangeLangtoHu}
              data-testid="navbar-language-hu"
            >
              <img
                src="https://flagcdn.com/w20/hu.png"
                width="20"
                alt="Hungary"
                style={{ marginRight: 3 }}
              />
              <Typography>{t("navbar.Hungarian")}</Typography>
            </MenuItem>
          </Menu>
          <themeSwitchContext.Consumer>
            {({ mode, switchMode }) => (
              <Switch
                checked={mode === "dark"}
                onChange={switchMode}
                inputProps={{ "aria-label": "Dark Mode" }}
              />
            )}
          </themeSwitchContext.Consumer>

          <Tooltip title="Account settings">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              data-testid="navbar-account-bubble"
            >
              <Avatar
                sx={{ width: 40, height: 40, backgroundColor: "primary.light" }}
              >
                
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem
              onClick={handleAccountNav}
              data-testid="navbar-account-menuitem"
            >
              <Avatar /> {t("navbar.myaccount")}
            </MenuItem>
            <MenuItem
              onClick={handleLogout}
              data-testid="navbar-logout-menuitem"
            >
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              {t("navbar.logout")}
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Suspense>
  );
}
