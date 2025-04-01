# Only-Fake News Generator

An AI-powered news article generator that creates engaging, fictional news content in real-time. Experience dynamic article generation with multiple news sources and a modern, responsive interface.

<p align="center">
  <img src="client/src/assets/logo.png" alt="Only-Fake News" width="200"/>
</p>

## 🔄 Extensible News Sources

The application is designed to easily scale with additional news sources. Each source can be added by implementing a simple extractor interface, making it straightforward to:

- Add new news sources
- Customize article generation per source
- Maintain consistent typing and validation
- Scale without changing the core architecture

Currently supporting CNN and GeekTime, with a plug-and-play architecture ready for expansion.

## 🚀 Getting Started

### Using Docker (Recommended)

1. Clone the repository
2. Set up environment:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

3. Update OpenAI API key in `server/.env`:

```env
SERVER_PORT=3002
OPENAI_API_KEY=your_key_here
```

4. Run with Docker using either:

Using yarn scripts:

```bash
yarn docker:build
yarn docker:up
```

Or directly with Docker commands:

```bash
docker-compose build
docker-compose up
```

To stop the application:

```bash
docker-compose down
```

The application will be available at:

- Frontend: http://localhost:3001
- Backend: http://localhost:3002

### Local Development

1. Install dependencies:

```bash
yarn install
```

2. Set up environment (if not done already):

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

3. Update OpenAI API key in `server/.env`

4. Build shared package:

```bash
yarn workspace @only-fake/shared build
```

5. Start development servers:

```bash
yarn dev
```

## 📁 Project Structure
