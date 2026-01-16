# Module 6B: Video Meetings (Agora SDK)

## Overview

Enable **real-time video/audio meetings** between client and provider within the project lifecycle using **Agora SDK**.

---

## 1. Meeting Context

### When Meetings Can Occur
- Only within **active projects** (post-deal approval)
- Between project **client** and **provider** only
- Optional: Scheduled or instant meetings

### Meeting Types
| Type | Description |
|------|-------------|
| **Instant** | Start immediately, notify other participant |
| **Scheduled** | Set date/time, both receive reminder |

---

## 2. Agora SDK Integration

### Required Agora Services
- **RTC (Real-Time Communication)** - Video/audio calls
- **RTM (Real-Time Messaging)** - Optional: call signaling

### Agora Credentials
```env
AGORA_APP_ID=your_app_id
AGORA_APP_CERTIFICATE=your_certificate
```

### Token Generation (Server-Side)
```typescript
// Server generates temporary token for each meeting
import { RtcTokenBuilder, RtcRole } from "agora-access-token";

function generateAgoraToken(channelName: string, uid: number): string {
    const appId = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;
    const expirationInSeconds = 3600; // 1 hour
    
    return RtcTokenBuilder.buildTokenWithUid(
        appId,
        appCertificate,
        channelName,
        uid,
        RtcRole.PUBLISHER,
        Math.floor(Date.now() / 1000) + expirationInSeconds
    );
}
```

---

## 3. Database Schema

```prisma
model Meeting {
    id            String    @id @default(uuid())
    projectId     String    @map("project_id")
    hostId        String    @map("host_id")       // Who initiated
    guestId       String    @map("guest_id")      // Other participant
    channelName   String    @unique @map("channel_name")
    status        String    @default("PENDING")   // PENDING, ACTIVE, COMPLETED, CANCELLED
    scheduledAt   DateTime? @map("scheduled_at")  // Null for instant
    startedAt     DateTime? @map("started_at")
    endedAt       DateTime? @map("ended_at")
    duration      Int?      // In seconds
    createdAt     DateTime  @default(now()) @map("created_at")
    updatedAt     DateTime  @updatedAt @map("updated_at")

    // Relations
    project  Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
    host     User    @relation("MeetingHost", fields: [hostId], references: [id])
    guest    User    @relation("MeetingGuest", fields: [guestId], references: [id])

    @@map("meetings")
}
```

---

## 4. API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/meetings` | Create/schedule meeting |
| GET | `/api/v1/meetings/project/:projectId` | Get project meetings |
| GET | `/api/v1/meetings/:id/token` | Get Agora token to join |
| PATCH | `/api/v1/meetings/:id/start` | Mark meeting started |
| PATCH | `/api/v1/meetings/:id/end` | Mark meeting ended |
| DELETE | `/api/v1/meetings/:id` | Cancel scheduled meeting |

---

## 5. Real-Time Socket Events

### Call Signaling

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `meeting:invite` | Server → Client | `{ meetingId, projectId, hostName }` | Invite to join |
| `meeting:accept` | Client → Server | `{ meetingId }` | Accept invitation |
| `meeting:decline` | Client → Server | `{ meetingId }` | Decline invitation |
| `meeting:started` | Server → Client | `{ meetingId, channelName, token }` | Meeting started |
| `meeting:ended` | Server → Client | `{ meetingId }` | Meeting ended |

---

## 6. Client Flow

### Initiating a Call
```javascript
// 1. Request meeting
const res = await fetch("/api/v1/meetings", {
    method: "POST",
    body: JSON.stringify({ projectId, guestId, type: "instant" })
});
const { meetingId, channelName } = await res.json();

// 2. Get token
const tokenRes = await fetch(`/api/v1/meetings/${meetingId}/token`);
const { token, uid } = await tokenRes.json();

// 3. Join Agora channel
const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
await client.join(AGORA_APP_ID, channelName, token, uid);
```

### Receiving a Call
```javascript
socket.on("meeting:invite", async ({ meetingId, hostName }) => {
    if (confirm(`${hostName} is calling. Accept?`)) {
        socket.emit("meeting:accept", { meetingId });
        // Redirect to meeting room
    } else {
        socket.emit("meeting:decline", { meetingId });
    }
});
```

---

## 7. Security Considerations

- ✅ Server-generated tokens (never expose certificate)
- ✅ Token expiration (1 hour max)
- ✅ Only project participants can join
- ✅ Unique channel names per meeting
- ✅ Meeting status validation before join

---

## 8. Implementation Phases

### Phase 1: Core
- [ ] Prisma schema for Meeting
- [ ] Agora token generation endpoint
- [ ] Create/join/end meeting API
- [ ] Socket events for call signaling

### Phase 2: Enhanced
- [ ] Scheduled meetings with reminders
- [ ] Meeting recordings (Agora Cloud Recording)
- [ ] Screen sharing support
- [ ] Meeting history/logs

---

## 9. Dependencies

```bash
npm install agora-access-token
# Frontend
npm install agora-rtc-sdk-ng
```
