#!/bin/bash

# Usage:
# ./backup_and_upload.sh <MYSQL_USER> <MYSQL_PASS> <MYSQL_DB> <LOCAL_BACKUP_DIR> <GOOGLE_DRIVE_FOLDER_ID>
# Example:
# ./backup_and_upload.sh myuser mypass mydb /home/admin/backups 1a2B3cD4eF5Gh6Ij

set -e

MYSQL_USER="$1"
MYSQL_PASS="$2"
MYSQL_DB="$3"
LOCAL_BACKUP_DIR="$4"
GDRIVE_FOLDER_ID="$5"

if [ $# -ne 5 ]; then
    echo "Usage: $0 <MYSQL_USER> <MYSQL_PASS> <MYSQL_DB> <LOCAL_BACKUP_DIR> <GOOGLE_DRIVE_FOLDER_ID>"
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DATE=$(date +%F_%H-%M-%S)
BACKUP_NAME="mysql_backup_${MYSQL_DB}_${DATE}.sql"
BACKUP_PATH="${SCRIPT_DIR}/${LOCAL_BACKUP_DIR}/${BACKUP_NAME}"

# 1. Create local backup directory if it does not exist
mkdir -p "$LOCAL_BACKUP_DIR"

# 2. Dump the MySQL database
while ! mysqladmin ping -u "$MYSQL_USER" -p"$MYSQL_PASS" --silent; do
    echo "Waiting for MySQL to start..."
    sleep 15
done
mysqldump -u "$MYSQL_USER" -p"$MYSQL_PASS" "$MYSQL_DB" > "$BACKUP_PATH"

if [ $? -ne 0 ]; then
    echo "MySQL dump failed!"
    exit 2
fi

# 3. Call upload-to-drive.js with the required parameters
node "$SCRIPT_DIR/server.js" "$BACKUP_PATH" "$BACKUP_NAME" "$GDRIVE_FOLDER_ID"

if [ $? -ne 0 ]; then
    echo "Upload to Google Drive failed!"
    exit 3
fi

echo "Backup and upload completed successfully: $BACKUP_PATH"