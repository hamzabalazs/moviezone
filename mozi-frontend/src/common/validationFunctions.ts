import { useTranslation } from "react-i18next";
import * as Yup from "yup";
const datevalidator =
  /(^(((0[1-9]|1[0-9]|2[0-8])[\/](0[1-9]|1[012]))|((29|30|31)[\/](0[13578]|1[02]))|((29|30)[\/](0[4,6,9]|11)))[\/](19|[2-9][0-9])\d\d$)|(^29[\/]02[\/](19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)/;

export function useEditUserSchema() {
  const { t } = useTranslation();

  return Yup.object({
    first_name: Yup.string().required(t("formikErrors.firstNameReq") || ""),
    last_name: Yup.string().required(t("formikErrors.lastNameReq") || ""),
    email: Yup.string()
      .required(t("formikErrors.emailReq") || "")
      .email(t("formikErrors.emailFormat") || ""),
    password: Yup.string()
      .required(t("formikErrors.passwordReq") || "")
      .test(
        "len",
        t("formikErrors.passwordLength") || "",
        (val) => val.length >= 5
      ),
    role: Yup.string().required(),
  });
}

export function useRegisterUserSchema() {
  const { t } = useTranslation();

  return Yup.object({
    first_name: Yup.string().required(t("formikErrors.firstNameReq") || ""),
    last_name: Yup.string().required(t("formikErrors.lastNameReq") || ""),
    email: Yup.string()
      .required(t("formikErrors.emailReq") || "")
      .email(t("formikErrors.emailFormat") || ""),
    password: Yup.string()
      .required(t("formikErrors.passwordReq") || "")
      .test(
        "len",
        t("formikErrors.passwordLength") || "",
        (val) => val.length > 5
      ),
  });
}

export function useLoginUserSchema() {
  const { t } = useTranslation();

  return Yup.object({
    email: Yup.string()
      .required(t("formikErrors.emailReq") || "")
      .email(t("formikErrors.emailFormat") || ""),
    password: Yup.string()
      .required(t("formikErrors.passwordReq") || "")
      .test(
        "len",
        t("formikErrors.passwordLength") || "",
        (val) => val.length >= 5
      ),
  });
}

export function useEditReviewSchema() {
  const { t } = useTranslation();

  return Yup.object({
    description: Yup.string().required(t("formikErrors.descriptionReq") || ""),
    rating: Yup.number().required(t("formikErrors.ratingReq") || ""),
  });
}

export function useEditMovieSchema() {
  const { t } = useTranslation();

  return Yup.object({
    title: Yup.string().required(t("formikErrors.titleReq") || ""),
    description: Yup.string().required(t("formikErrors.descriptionReq") || ""),
    release_date: Yup.string()
      .required(t("formikErrors.release_dateReq") || "")
      .matches(datevalidator, t("formikErrors.release_dateFormat") || ""),
  });
}

export function useEditCategorySchema() {
  const { t } = useTranslation();

  return Yup.object({
    name: Yup.string().required(t("formikErrors.nameReq") || ""),
  });
}

export function useAddMovieSchema() {
  const { t } = useTranslation();

  return Yup.object({
    title: Yup.string().required(t("formikErrors.titleReq") || ""),
    description: Yup.string().required(t("formikErrors.descriptionReq") || ""),
    release_date: Yup.string()
      .required(t("formikErrors.release_dateReq") || "")
      .matches(datevalidator, t("formikErrors.release_dateFormat") || ""),
    //category: Yup.string().required(t("formikErrors.categoryReq") || ""),
  });
}
