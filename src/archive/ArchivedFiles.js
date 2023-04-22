import MyNav from "../utils/MyNav";
import useConfig from "../hooks/useConfig";
import ArchiveList from "./ArchiveList";
import LoadingPage from "../utils/LoadingPage";

function ArchivedFiles() {
  const { config, loading } = useConfig();

  return loading ? (
    <LoadingPage />
  ) : (
    <div className="container bg-light">
      <MyNav active="archived-files" />
      <ArchiveList config={config} />
    </div>
  );
}

export default ArchivedFiles;
