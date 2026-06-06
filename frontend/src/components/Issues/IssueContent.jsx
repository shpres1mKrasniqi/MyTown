import { formatDate } from "../../utils/formatDate";

export default function IssueContent({ issue }) {
  return (
    <div className="px-3 py-2 space-y-1">
      <p className="text-sm">
        <span className="font-semibold mr-2">{issue.title}</span>
        {issue.description}
      </p>

      <p className="text-[10px] text-gray-400">
        {formatDate(issue.createdAt || issue.files?.[0]?.createdAt)}
      </p>
    </div>
  );
}
