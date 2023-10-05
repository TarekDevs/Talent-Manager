import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";
import BillingInformation from "./layouts/billing/components/BillingInformation"; // react quiz
import { useState, useEffect, useMemo } from "react";
import routes from "routes";
import BillingInformationn from "./layouts/Nodequiz/components/BillingInformation";  // node quiz
import BillingInformationnn from "./layouts/angularquiz/components/BillingInformation"; //angular quiz
import BillingInformationnnn from "./layouts/Dotnetquiz/components/BillingInformation" // dotnetquiz

// react-router components
import {useLocation } from "react-router-dom";
import Tables from "layouts/tables";

export default function App() {

  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();

  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route}
         element={route.component}
          key={route.key} />;
      }

      return null;
    });

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  return direction === "rtl" ? (
    
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
        <CssBaseline />
        {layout === "dashboard" && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
              brandName=" Talent-Manager"
              routes={routes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            <Configurator />
            {configsButton}
          </>
        )}
        {layout === "vr" && <Configurator />}
        <Routes>
          {getRoutes(routes)}
          <Route
            path="/dashboard/skills/:id"
            element={<Tables />} // Render your Tables component
          />

            <Route
              path="/quiz/64dbfdf72b4cd0c3dd04ab92"
              element={<BillingInformation />}
            />
            <Route
              path="/quiz/64dbfe892b4cd0c3dd04ab94"
              element={<BillingInformationn />}
            />
              <Route
              path="/quiz/64dbfec52b4cd0c3dd04ab96"
              element={<BillingInformationnn />}
            />
              <Route
              path="/quiz/64dbfeeb2b4cd0c3dd04ab98"
              element={<BillingInformationnnn />}
            />
              <Route path="*" element={<Navigate to="/authentication/sign-in" />} />
        </Routes>

      </ThemeProvider>
    </CacheProvider>
  ) : (
    <>
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {layout === "dashboard" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
            brandName=" Talent-Manager"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
          {configsButton}
        </>
      )}
      {layout === "vr" && <Configurator />}
      <Routes>
        {getRoutes(routes)}
      
            <Route
              path="/quiz/64dbfdf72b4cd0c3dd04ab92"
              element={<BillingInformation />}
            />
              <Route
              path="/quiz/64dbfe892b4cd0c3dd04ab94"
              element={<BillingInformationn />}
            />
              <Route
              path="/quiz/64dbfec52b4cd0c3dd04ab96"
              element={<BillingInformationnn />}
            />
              <Route
              path="/quiz/64dbfeeb2b4cd0c3dd04ab98"
              element={<BillingInformationnnn/>}
            />
         
          <Route path="*" 
          element={<Navigate to="/authentication/sign-in" />} />
</Routes>
 
   
    </ThemeProvider>
   
  
</>
  );
}