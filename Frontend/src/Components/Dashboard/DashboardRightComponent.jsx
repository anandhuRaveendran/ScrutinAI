import AuditPie from "../Charts/PieChart";
import NotificationPanel from "../Nofitication/NotificationPanel";

const DashboardRightComponent = () => {
    const demoStats = {
        pieData: [
            { name: "Passed", value: 8 },
            { name: "Issues Found", value: 3 },
            { name: "Manual Review", value: 1 },
        ],
    };

    return (
        <aside className="col-span-12 lg:col-span-3">
            <div className="sticky top-6 space-y-4">
                <AuditPie data={demoStats.pieData} />
                <NotificationPanel />
            </div>
        </aside>
    );
};

export default DashboardRightComponent;