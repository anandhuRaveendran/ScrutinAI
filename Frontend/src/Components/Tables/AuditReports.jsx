import React from "react";
import { FaEye, FaDownload } from "react-icons/fa";
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  CardFooter,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";

const REPORTS = [
  { id: 1, name: "ERC721 Membership Audit", date: "12/07/24", status: "Resolved" },
  { id: 2, name: "DeFi Staking Contract Audit", date: "10/07/24", status: "Resolved" },
  { id: 3, name: "DAO Governance Audit", date: "05/07/24", status: "Informational" },
];

const TABLE_HEAD = ["Report Name", "Date", "Status", "Actions"];

export default function AuditReports() {
  const handleView = (report) => {
    alert(`View report: "${report.name}"`);
  };

  const handleDownload = (report) => {
    alert(`Download for "${report.name}" coming soon!`);
  };

  return (
    <Card className="w-full max-w-full bg-[#1A2536] border border-white">
      <CardHeader floated={false} shadow={false} className="bg-[#1A2536] pl-5">
      </CardHeader>
      <CardBody className="p-0">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-b border-white bg-blue-gray-50/50 px-4 pb-4 text-sm text-white mb-2"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {REPORTS.map((report, index) => (
              <tr
                key={report.id}
                className={` transition ${
                  index % 2 === 0 ? "bg-[#1A2536]" : "bg-[#1A2536]/80"
                }`}
              >
                <td className="px-4 py-3">
                  <Typography variant="small" color="white" className="font-medium">
                    {report.name}
                  </Typography>
                </td>
                <td className="px-4 py-3 text-white font-medium">{report.date}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      report.status === "Resolved"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {report.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex item-center gap-5">
                  <Tooltip content="View Report" >
                    <IconButton
                      variant="filled"
                      color="blue"
                      size="sm"
                      onClick={() => handleView(report)}
                      className="focus:outline-none"
                      aria-label={`View report ${report.name}`}
                    >
                      <FaEye className="h-4 w-4" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip content="Download Report">
                    <IconButton
                      variant="filled"
                      color="green"
                      size="sm"
                      onClick={() => handleDownload(report)}
                      className="focus:outline-none"
                      aria-label={`Download report ${report.name}`}
                    >
                      <FaDownload className="h-4 w-4" />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}