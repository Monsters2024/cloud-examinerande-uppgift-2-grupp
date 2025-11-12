# Sammanfattning om Projektet

Vi skapade branches utifrån det vi ville implementera. Vi hade som regel att döpa varje branch till "BUG/" eller "FEATURE/", plus i följd med vad som skulle implementeras, för att veta vilken issue det gäller. Om det är en bugfix, då börjar alla branch-namn med BUG/, och om det var en ny funktion som skulle implementeras, då döptes branches med FEATURE/. En branch där man implementerar en ny funktion för att t.ex. filtrera och sortera, skulle kunna heta "FEATURE/filterAndSort".

Vi hade tydliga commit meddelanden och jobbade varsamt med våra commits för att kunna se tydligt vad som ändrats.

För att få igenom sin kod, in till development branchen, då behövde man skicka en pull request och minst en annan i teamet behövde granska den, för att den skulle bli godkänd. Vi körde mycket via discord, så det blev så att vi granskade pull request när vi satt i möten och gick igenom dessa tillsammans, även med den som hade gjort koden. När koden hade granskats, då skrev vi bara en lätt kommentar för att visa att det såg bra ut, innan det kunde mergas in till development branchen. Vi märkte det med "LGTM" = Looks Good To Me.

Vi använde oss av Github projects, där vi gjorde issues med bugs eller features. Sedan fick man assigna valfria issues till sig själv för att visa andra vilka man jobbade på, så dubbelarbete inte görs.

Vi använde oss utav AI för att bland annat generera tester. Vi granskade så mycket som möjligt av det som vi tagit fram med AI, men desto närmare inpå deadline blev det mindre granskning av den AI genererade koden.

Vi använder en CI/CD-pipeline för att automatisera bygget och deployment av appen. Lint och tester körs automatiskt för att säkerställa kodkvalitet och att buggar upptäcks innan kod mergas. Detta skapar en stabil och konsekvent miljö, vilket gör det enklare att utveckla nya funktioner utan att riskera att något slutar fungera.

Vi använder lint och automatiska tester i pipelinen för att säkerställa att koden fungerar och följer våra kodstandarder innan den deployas. På så sätt blir CI/CD mer än bara en enkel deploy och den hjälper oss att hålla koden stabil, samt av hög kvalitet.






# Journal App - Student Assignment Starter

A minimalist journaling application built with Next.js 14, TypeScript, Tailwind CSS, and Supabase. This project serves as a starting point for students to practice debugging, adding features, and improving existing code.


## Tech Stack

- **Frontend Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Backend/Database:** Supabase (Authentication + PostgreSQL)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url> # eller forka
cd cloud-examinerande-uppgift-2-grupp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Skapa nytt projekt på supabase
2. Kör allt som finns i `supabase/schema.sql` i SQL-editorn
3. Hitta API-nycklar på Supabase och ersätt i .env.example

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Design Philosophy

This app follows a minimalist, editorial design approach:

- **Typography:** Serif fonts for headings, sans-serif for body text
- **Color Palette:** Cream backgrounds with dark brown text and warm gray accents
- **Spacing:** Generous whitespace for readability
- **Layout:** Clean, centered layouts with maximum content width
- **Interaction:** Subtle hover states and transitions


## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## Fyll på med era reflektioner nedan!
