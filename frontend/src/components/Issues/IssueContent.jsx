import { formatDate } from "../../utils/formatDate";

export default function IssueContent({ issue }) {
  return (
    <div className="px-3 py-2">
      <p className="text-sm">
        <span className="font-semibold">{issue.title}</span> {issue.description}
      </p>

      <p className="text-[10px] text-gray-400">
        {formatDate(issue.files?.[0]?.createdAt)}
      </p>
    </div>
  );
}
