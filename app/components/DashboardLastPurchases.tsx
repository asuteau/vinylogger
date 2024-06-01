type DashboardLastPurchasesProps = {
  totalItems: number;
  lastPurchases: any[];
};

const DashboardLastPurchases = ({totalItems, lastPurchases}: DashboardLastPurchasesProps) => {
  return (
    <>
      <h3 className="font-bold text-gray-950">Purchased recently</h3>
      <h3 className="text-gray-600 pb-4">
        <b>{totalItems}</b> releases in collection
      </h3>

      <section className="flex flex-col gap-4 p-4 bg-gray-100 rounded-xl max-h-60 overflow-auto overflow-x-hidden">
        {lastPurchases.map((release) => {
          return (
            <div className="flex items-center gap-4" key={release.basic_information.id}>
              <img src={release.basic_information.thumb} className="w-24 h-24 rounded-lg shadow-sm" />
              <div className="flex flex-col text-xs text-gray-950">
                <span className="font-bold">
                  {release.basic_information.artists.map((artist) => artist.name).join(', ')}
                </span>
                <span>{release.basic_information.title}</span>
                <span className="text-gray-600">
                  {release.basic_information.formats.map((format) => format.name).join(', ')}
                </span>
                <span className="text-gray-500">Purchased on {new Date(release.date_added).toLocaleDateString()}</span>
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
};

export default DashboardLastPurchases;
