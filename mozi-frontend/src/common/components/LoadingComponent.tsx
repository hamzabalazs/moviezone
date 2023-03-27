import { FadeLoader } from "react-spinners";

export default function LoadingComponent(loading: boolean) {
  return (
    <div style={{textAlign:"center",display:"flex",justifyContent:"center",alignItems:"center",width:"100%",height:"100vh"}}>
      <FadeLoader
        color={"#9ccc65"}
        loading={loading}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
}
