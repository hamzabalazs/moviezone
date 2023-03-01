import { Typography } from "@mui/material";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";

export default function MyFooter() {
  const { t } = useTranslation();
  return (
    <Suspense fallback="Loading...">
      <footer
        style={{ position: "absolute", bottom: -100, width: "100%" }}
        data-testid="footer"
      >
        <Typography
          variant="subtitle1"
          align="right"
          color="textSecondary"
          paddingRight={2}
          paddingBottom={2}
          data-testid="footerContent"
        >
          {t("footer")}
        </Typography>
      </footer>
    </Suspense>
  );
}
