import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Cast } from "../../gql/graphql";
import { useSessionContext } from "../../auth/context/SessionContext";
import { useEffect, useState } from "react";
import NavigationBar from "../../common/components/NavigationBar";
import CastEditModal from "../components/CastEditModal";
import CastDeleteDialog from "../components/CastDeleteDialog";
import { useCastPageData } from "../hooks/useCastPageData";
import CastPageCard from "../components/CastPageCard";

export default function CastPage() {
  const { currcast_id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user: currUser } = useSessionContext();
  const {cast,movies,error,loading} = useCastPageData(currcast_id!)

  const [editingCast, setEditingCast] = useState<Cast | undefined>(undefined);
  const [deletingCast, setDeletingCast] = useState<Cast | undefined>(undefined);

  useEffect(() => {
    if (!currUser) navigate("/login");
  }, []);

  return (
    <>
      <NavigationBar />
      <main style={{ position: "relative", minHeight: "100vh" }}>
        <div style={{ paddingBottom: "2.5rem" }}>
          <CastEditModal
            cast={editingCast}
            movie={null}
            onClose={() => setEditingCast(undefined)}
          />
          <CastDeleteDialog
            cast={deletingCast}
            movie={null}
            onClose={() => setDeletingCast(undefined)}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 10,
          }}
        >
            {cast && (
                <CastPageCard 
                    cast={cast}
                    onEdit={() => setEditingCast(cast)}
                    onDelete={() => setDeletingCast(cast)}
                />
            )}
        </div>
      </main>
    </>
  );
}
