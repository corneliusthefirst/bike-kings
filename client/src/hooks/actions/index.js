import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function friendObject(user, room) {
  if (user?.id === room.sender.id) return room.receiver

  return room.sender
}

export function useLocationEffect(callback) {
  const location = useLocation();

  useEffect(() => {
    callback(location);
  }, [location, callback]);
}

export function isMemberOfGroup(group, user) {
  return group.members.filter((member) => member.id === user.id).length > 0;
}