import { useTranslation } from "react-i18next";
import { Movie } from "../../gql/graphql";
import { useSnackbar } from "notistack";
import { useSessionContext } from "../../auth/context/SessionContext";
import { useState } from "react";

interface Props {
    movie?: Movie;
    onClose?: () => void;
  }

  export default function MovieCastModal({ movie,onClose }: Props){
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const { logOut } = useSessionContext();
    const [photo, setPhoto] = useState<string>("")

    const formikValues = {

    }
  }