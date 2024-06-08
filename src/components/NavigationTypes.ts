export type RootStackParamList = {
    WorldPage: undefined,
    LoginPage: undefined,
    JoinedRoomsPage: undefined,
    ProfilePage: undefined,
    NormsPage: undefined,
    JoinedRoomPage: { data: { 
      roomId: string; 
    }; },

    InvitesPage: undefined,
    NotJoinedRoomPage: { data: { 
      roomId: string; 
    }; },
  };
