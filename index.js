import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

/* ========= RUTA RAÍZ ========= */
app.get("/", (req, res) => {
  res.send("perfil-api online");
});

/* ========= PERFIL (JSON) ========= */
app.get("/perfil", async (req, res) => {
  try {
    const username = req.query.username;
    if (!username) {
      return res.status(400).json({ error: "Falta username" });
    }

    // 1️⃣ username -> userId (ROBLOX OFICIAL)
    const r = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usernames: [username],
        excludeBannedUsers: false
      })
    });

    const j = await r.json();

    if (!j.data || !j.data.length) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const userId = j.data[0].id;

    // 2️⃣ URL avatar (cara)
    const avatar =
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=true`;

    res.json({
      username,
      userId,
      avatar
    });

  } catch (err) {
    res.status(500).json({ error: "Error interno" });
  }
});

/* ========= PERFIL IMAGEN DIRECTA ========= */
app.get("/perfil/imagen", async (req, res) => {
  try {
    const username = req.query.username;
    if (!username) {
      return res.status(400).send("Falta username");
    }

    // 1️⃣ username -> userId
    const r = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usernames: [username],
        excludeBannedUsers: false
      })
    });

    const j = await r.json();

    if (!j.data || !j.data.length) {
      return res.status(404).send("Usuario no encontrado");
    }

    const userId = j.data[0].id;

    // 2️⃣ URL avatar
    const avatarUrl =
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=true`;

    // 3️⃣ REDIRECT DIRECTO A LA IMAGEN
    res.redirect(avatarUrl);

  } catch (err) {
    res.status(500).send("Error interno");
  }
});

/* ========= START ========= */
app.listen(PORT, () => {
  console.log("perfil-api corriendo en puerto", PORT);
});