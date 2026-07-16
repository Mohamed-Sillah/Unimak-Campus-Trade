import { Link } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <aside>
      
      <ul style={{display:"flex", gap:"1rem",listStyleType:"none", textDecoration:"none"}}>
        <li><Link to="/admin" style={{textDecoration:"none" }}>Dashboard</Link></li>
        <li><Link to="/admin/create-listing"style={{textDecoration:"none"}}>Create Listing</Link></li>
        {/* Orders and Payouts removed per SRS (off-system handling) */}
      </ul>
    </aside>
  );
}