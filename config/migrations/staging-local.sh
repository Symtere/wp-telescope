wp db export local.sql
wp db import staging.sql
wp option update blog_public 0
wp search-replace telescope.staging telescope.local --all-tables 
wp rewrite flush