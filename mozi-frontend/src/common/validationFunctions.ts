import { useTranslation } from "react-i18next";
import * as Yup from "yup";
const datevalidator =
/^\d{4}-\d{2}-\d{2}$/;
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
        (val) => val.length >= 5
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
  });
}

export function useAddCastSchema(){
  const { t } = useTranslation();

  return Yup.object({
    name: Yup.string().required(t("formikErrors.nameReq") || "")
  })
}

export function useEditCastSchema(){
  const { t } = useTranslation();

  return Yup.object({
    name: Yup.string().required(t("formikErrors.nameReq") || "")
  })
}
