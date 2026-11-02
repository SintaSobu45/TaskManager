
function Navbar({ totalCount, completedCount, pendingCount }) {
    return (
        <header className="navbar">
            <div className="navbar-brand">
                <div className="brand-icon">T</div>

                <div>
                    <h1>TaskManager</h1>
                    <p>Organize your work. Get things done.</p>
                </div>
            </div>

            <div className="navbar-status">
                <span className="status-dot"></span>
                Task workspace
            </div>
        </header>
    );
}

export default Navbar;
