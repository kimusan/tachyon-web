# File certain messages and mark as read
```
require ["fileinto","imap4flags"];

if header :contains ["To", "CC"] "demo+sieve@tachyon.eu"
{
    addflag "\\Seen";
    fileinto "Tachyon.demo";
    stop;
}
```

# Vacation Responder
```
require ["date", "relational", "vacation"];

if allof(currentdate :value "ge" "date" "2023-08-01", currentdate :value "le" "date" "2023-08-17") {
    vacation :days 4 :subject "I'm not at the pineapple" :addresses ["Forward <squidward@example.com>"] "I'm monitoring a stone at the moment. Will be back when Patrick returns. Best regards, Mr. SquarePants";
}
```

# Put messages in folders by date
```
require ["date", "variables", "fileinto"];

if currentdate :matches "month" "*" { set "month" "${1}"; }
if currentdate :matches "year"  "*" { set "year"  "${1}"; }
fileinto "INBOX.${year}-${month}";
```
