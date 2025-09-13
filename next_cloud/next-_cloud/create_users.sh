#!/bin/bash

# Script to create the 4 users in Nextcloud
# This script will be run inside the Nextcloud container

echo "Creating users in Nextcloud..."

# Wait for Nextcloud to be fully initialized
sleep 10

# Create the 4 users as mentioned in the mock data
# Alice Johnson, Bob Smith, Carol Davis, David Wilson

# Alice Johnson
docker exec nextcloud-dev php occ user:add --password-from-env --display-name="Alice Johnson" alice
echo "alice:alice123" | docker exec -i nextcloud-dev php occ user:add --password-from-env alice

# Bob Smith  
echo "bob:bob123" | docker exec -i nextcloud-dev php occ user:add --password-from-env bob
docker exec nextcloud-dev php occ user:add --password-from-env --display-name="Bob Smith" bob

# Carol Davis
echo "carol:carol123" | docker exec -i nextcloud-dev php occ user:add --password-from-env carol
docker exec nextcloud-dev php occ user:add --password-from-env --display-name="Carol Davis" carol

# David Wilson
echo "david:david123" | docker exec -i nextcloud-dev php occ user:add --password-from-env david
docker exec nextcloud-dev php occ user:add --password-from-env --display-name="David Wilson" david

echo "Users created successfully!"
echo "Users:"
echo "- alice (Alice Johnson) - password: alice123"
echo "- bob (Bob Smith) - password: bob123" 
echo "- carol (Carol Davis) - password: carol123"
echo "- david (David Wilson) - password: david123"
