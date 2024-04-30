<!-- @format -->

# Outline

## APIS

Functions which interact directly with external APIs

### Irish Names

- Fetches records of Irish names
- Used to determine gender by name

### Oireachtas

- Fetches and returns details of constituency, house, member and party party.
  - Member details are processed and reformatted.
- Fetches and formates records of debates, questions and votes

## Scrape Websites

### Oireachtas

#### Attendance

House

- Uses json file reference to fetch reports
- Parses reports to extract individual attendance info
- Fetches member details and assigns by similarity the records for each member
  Committee
