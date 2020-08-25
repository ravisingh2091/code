#! /bin/bash
cd /usr/src/app/
sed -i "s/db_host/${db_host}/g" /usr/src/app/.env
sed -i "s/db_user/${db_user}/g" /usr/src/app/.env
sed -i "s/db_password/${db_password}/g" /usr/src/app/.env
sed -i "s/db_port/${db_port}/g" /usr/src/app/.env
sed -i "s/db_provider/${db_provider}/g" /usr/src/app/.env
sed -i "s/database/${database}/g" /usr/src/app/.env
sed -i "s/host/${host}/g" /usr/src/app/.env
sed -i "s/app_env/${app_env}/g" /usr/src/app/.env
sed -i "s/service_port/${service_port}/g" /usr/src/app/.env
sed -i "s/access_domain/${access_domain}/g" /usr/src/app/.env
sed -i "s/client/${client}/g" /usr/src/app/.env
sed -i "s/orch_version/${orch_version}/g" /usr/src/app/.env
sed -i "s/case_url/${case_url}/g" /usr/src/app/.env
sed -i "s/user_url/${user_url}/g" /usr/src/app/.env
sed -i "s/master_url/${master_url}/g" /usr/src/app/.env
sed -i "s/orch_url/${orch_url}/g" /usr/src/app/.env
sed -i "s/taxes_url/${taxes_url}/g" /usr/src/app/.env
sed -i "s/communication_url/${communication_url}/g" /usr/src/app/.env
sed -i "s/frontend_url/${frontend_url}/g" /usr/src/app/.env
npm run start:seed
pm2 start processes.json --no-daemon