import {
  AppBar,
  Avatar,
  Button,
  IconButton,
  ListItemIcon,
  Menu,
  Link,
  MenuItem,
  Switch,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { Suspense, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import VideocamIcon from "@mui/icons-material/Videocam";
import Logout from "@mui/icons-material/Logout";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import { themeSwitchContext } from "../../themeSwitchContext";
import { useSessionContext } from "../../auth/context/SessionContext";
import { useSnackbar } from "notistack";
import DashboardIcon from "@mui/icons-material/Dashboard";

export default function NavigationBar() {
  const context = useSessionContext();
  const currUser = context.user;

  const navigate = useNavigate();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogout = () => {
    context.logOut();
    const msg = t("navbar.logoutSuccess");
    enqueueSnackbar(msg, { variant: "success" });
    navigate("/login");
  };

  const handleAccountNav = () => {
    navigate("/account");
  };

  const handleDashboardNav = () => {
    navigate("/dashboard");
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

  const handleChangeLangToRo = () => {
    i18n.changeLanguage("ro");
    localStorage.setItem("lang", "ro");
  }

  return (
    <Suspense fallback="Loading...">
      {currUser && (
        <AppBar
          position="relative"
          sx={{ backgroundColor: "primary.dark" }}
          data-testid="navbarcomponent"
        >
          <Toolbar id="back-to-top-anchor">
            <IconButton
              component={RouterLink}
              to="/"
              data-testid="navbar-home-icon"
            >
              <VideocamIcon sx={{ fontSize: 40 }} />
            </IconButton>
            {currUser.role === "admin" && (
              <>
                <Link
                  component={RouterLink}
                  to="/"
                  underline="none"
                  variant="h6"
                  sx={{ color: "text.primary", marginLeft: 1 }}
                  data-testid="navbar-home-link"
                >
                  MovieZone
                </Link>
                <Link
                  component={RouterLink}
                  to="/categories"
                  underline="none"
                  variant="h6"
                  sx={{ color: "text.primary", marginLeft: 4 }}
                  data-testid="navbar-categories-link"
                >
                  {t("navbar.Categories")}
                </Link>
                <Link
                  component={RouterLink}
                  to="/users"
                  underline="none"
                  variant="h6"
                  sx={{ color: "text.primary", marginLeft: 4, flexGrow: 1 }}
                  data-testid="navbar-users-link"
                >
                  {t("navbar.Users")}
                </Link>
              </>
            )}
            {currUser.role === "editor" && (
              <>
                <Link
                  component={RouterLink}
                  to="/"
                  underline="none"
                  variant="h6"
                  sx={{ color: "text.primary" }}
                  data-testid="navbar-home-link"
                >
                  MovieZone
                </Link>
                <Link
                  component={RouterLink}
                  to="/categories"
                  underline="none"
                  variant="h6"
                  sx={{ color: "text.primary", marginLeft: 4, flexGrow: 1 }}
                  data-testid="navbar-categories-link"
                >
                  {t("navbar.Categories")}
                </Link>
              </>
            )}
            {currUser.role === "viewer" && (
              <>
                <Link
                  component={RouterLink}
                  to="/"
                  underline="none"
                  variant="h6"
                  sx={{ color: "text.primary" }}
                  data-testid="navbar-home-link"
                >
                  MovieZone
                </Link>
                <Link
                  component={RouterLink}
                  to="/reviews"
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
              <MenuItem
                onClick={handleChangeLangToRo}
                data-testid="navbar-language-ro"
              >
                <img
                  src="https://flagcdn.com/w20/ro.png"
                  width="20"
                  alt="Romania"
                  style={{ marginRight: 3 }}
                />
                <Typography>{t("navbar.Romanian")}</Typography>
              </MenuItem>
            </Menu>
            <themeSwitchContext.Consumer>
              {({ mode, switchMode }) => (
                <Switch
                  checked={mode === "dark"}
                  onChange={switchMode}
                  inputProps={{ "aria-label": "Dark Mode" }}
                  id="themeSwitcher"
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
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: "primary.light",
                  }}
                ></Avatar>
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
              {currUser.role === "admin" && (
                <MenuItem
                  onClick={handleDashboardNav}
                  data-testid="navbar-account-dashboard"
                >
                  <DashboardIcon sx={{ marginRight: 1.5 }} />{" "}
                  {t("navbar.dashboard")}
                </MenuItem>
              )}
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
      )}
    </Suspense>
  );
}
