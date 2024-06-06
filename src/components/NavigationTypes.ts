export type RootStackParamList = {
    WorldPage: undefined,
    LoginPage: undefined,
    JoinedRoomsPage: undefined,
    ProfilePage: undefined,
    JoinedRoomPage: { data: { 
      roomId: string; 
      roomContent: string;
    }; },

    InvitesPage: undefined,
    NotJoinedRoomPage: { data: { 
      roomId: string; 
      roomContent: string;
    }; },
  };
