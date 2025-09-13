# PowerShell script to create the 4 users in Nextcloud
# This script will be run to add users to the Nextcloud container

Write-Host "Creating users in Nextcloud..."

# Wait for Nextcloud to be fully initialized
Start-Sleep -Seconds 30

# Create the 4 users as mentioned in the mock data
# Alice Johnson, Bob Smith, Carol Davis, David Wilson

Write-Host "Creating user: alice (Alice Johnson)"
docker exec nextcloud-dev php occ user:add --password-from-env --display-name="Alice Johnson" alice
echo "alice123" | docker exec -i nextcloud-dev php occ user:add --password-from-env alice

Write-Host "Creating user: bob (Bob Smith)"
echo "bob123" | docker exec -i nextcloud-dev php occ user:add --password-from-env bob
docker exec nextcloud-dev php occ user:add --password-from-env --display-name="Bob Smith" bob

Write-Host "Creating user: carol (Carol Davis)"
echo "carol123" | docker exec -i nextcloud-dev php occ user:add --password-from-env carol
docker exec nextcloud-dev php occ user:add --password-from-env --display-name="Carol Davis" carol

Write-Host "Creating user: david (David Wilson)"
echo "david123" | docker exec -i nextcloud-dev php occ user:add --password-from-env david
docker exec nextcloud-dev php occ user:add --password-from-env --display-name="David Wilson" david

Write-Host "Users created successfully!"
Write-Host "Users:"
Write-Host "- alice (Alice Johnson) - password: alice123"
Write-Host "- bob (Bob Smith) - password: bob123" 
Write-Host "- carol (Carol Davis) - password: carol123"
Write-Host "- david (David Wilson) - password: david123"
