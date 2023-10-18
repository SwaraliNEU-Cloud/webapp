# Update and upgrade the system
sudo apt update && sudo apt -y upgrade

# Install Node.js, npm, MariaDB server, and client
sudo apt -y install nodejs npm mariadb-server mariadb-client

# Start and enable MariaDB
sudo systemctl start mariadb
sudo systemctl enable mariadb

DB_NAME="swaradb"
if sudo mysql -u root -e "USE $DB_NAME" 2>/dev/null; then
    echo "Database $DB_NAME already exists."
else
    echo "Creating database $DB_NAME..."
    sudo mysql -u root -proot -e "CREATE DATABASE $DB_NAME;"
    sudo mysql -u root -proot -e "GRANT ALL PRIVILEGES ON $DB_NAME.* TO 'root'@'localhost' IDENTIFIED BY 'root';"
    sudo mysql -u root -proot -e "FLUSH PRIVILEGES;"
    sudo mysql -u root -proot -e "SHOW DATABASES;"
    echo "Database $DB_NAME created."

fi
