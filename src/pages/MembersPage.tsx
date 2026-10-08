import React, { useState } from 'react';
import { useHome } from '../context/HomeContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../locales';
import { UserRole } from '../types/user';
import { 
  Users, 
  Copy, 
  Check, 
  ShieldCheck, 
  UserMinus, 
  Key, 
  Crown, 
  AlertTriangle,
  UserPlus
} from 'lucide-react';

export const MembersPage: React.FC = () => {
  const { 
    currentHome, 
    isOwner, 
    updateMemberRole, 
    removeMember, 
    transferOwnership 
  } = useHome();
  const { user } = useAuth();
  const { t, language } = useTranslation();

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const [selectedRoleUser, setSelectedRoleUser] = useState<string | null>(null);
  const [transferTargetId, setTransferTargetId] = useState<string | null>(null);

  if (!currentHome) return null;

  const safeCopy = async (text: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // Fallback below
    }
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    } catch {
      return false;
    }
  };

  const handleCopyCode = async () => {
    await safeCopy(currentHome.inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = async () => {
    await safeCopy(currentHome.inviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleTransfer = (targetId: string) => {
    if (window.confirm(t.members.transferConfirm)) {
      transferOwnership(targetId);
      setTransferTargetId(null);
    }
  };

  const handleRemove = (targetId: string) => {
    if (window.confirm(t.members.removeConfirm)) {
      removeMember(targetId);
    }
  };

  return (
    <div className="w-full space-y-space-xl">
      
      {/* Top Header */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-md pb-space-md border-b border-surface-container-highest">
        <div>
          <span className="font-label-caps text-xs text-primary font-bold uppercase tracking-widest block mb-1">
            SANCTUARY ROSTER // MEMBERS
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-on-surface">
            {t.members.title}
          </h1>
          <p className="font-body-md text-secondary text-sm mt-1">
            {t.members.subtitle}
          </p>
        </div>
      </section>

      {/* Invitations Card */}
      <section className="p-space-lg bg-surface-container-lowest rounded-2xl border border-surface-container-highest shadow-card space-y-4">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-primary" />
          <h3 className="font-headline text-base font-bold uppercase tracking-tight text-on-surface">
            {t.members.inviteMember}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Invite Code */}
          <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container-highest flex items-center justify-between">
            <div>
              <span className="font-label-caps text-[10px] uppercase text-secondary tracking-widest block">
                {t.members.inviteCodeLabel}
              </span>
              <span className="font-mono text-lg font-bold text-on-surface tracking-widest">
                {currentHome.inviteCode}
              </span>
            </div>
            <button
              onClick={handleCopyCode}
              className="p-2 rounded-lg bg-surface hover:bg-surface-container transition-colors text-secondary hover:text-on-surface"
              title={t.common.copy}
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Invite Link */}
          <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container-highest flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <span className="font-label-caps text-[10px] uppercase text-secondary tracking-widest block">
                {t.members.inviteLinkLabel}
              </span>
              <span className="font-mono text-xs text-on-surface truncate block">
                {currentHome.inviteLink}
              </span>
            </div>
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-lg bg-surface hover:bg-surface-container transition-colors text-secondary hover:text-on-surface shrink-0"
              title={t.common.copy}
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </section>

      {/* Members Roster List */}
      <section className="bg-surface-container-lowest rounded-2xl border border-surface-container-highest overflow-hidden shadow-card">
        <div className="p-space-md border-b border-surface-container-highest bg-surface-container-low flex items-center justify-between">
          <span className="font-label-caps text-xs uppercase tracking-widest text-secondary font-bold">
            ROSTER ({currentHome.members.length})
          </span>
          <span className="font-caption text-xs text-secondary font-mono">
            ROLE_HIERARCHY
          </span>
        </div>

        <div className="divide-y divide-surface-container-highest">
          {currentHome.members.map((member) => {
            const isSelf = member.userId === user?.id;
            const isMemberOwner = member.role === 'OWNER';

            return (
              <div
                key={member.userId}
                className="p-space-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-container-low transition-colors"
              >
                {/* User Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatarUrl}
                    alt={member.displayName}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-surface-container-highest"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-headline font-bold text-base text-on-surface">
                        {member.displayName}
                      </span>
                      {isSelf && (
                        <span className="font-label-caps text-[10px] px-1.5 py-0.2 rounded bg-surface-container text-secondary uppercase font-semibold">
                          {t.common.you}
                        </span>
                      )}
                    </div>
                    <span className="font-caption text-xs text-secondary">
                      @{member.username} · {t.members.joinedOn} {new Date(member.joinedAt).toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US')}
                    </span>
                  </div>
                </div>

                {/* Role & Management Actions */}
                <div className="flex items-center gap-3 self-end sm:self-center">
                  
                  {/* Role Selector (Owner only) */}
                  {isOwner && !isMemberOwner ? (
                    <select
                      value={member.role}
                      onChange={(e) => updateMemberRole(member.userId, e.target.value as UserRole)}
                      className="px-2.5 py-1.5 rounded-lg bg-surface-container-low border border-surface-container-highest text-xs font-label-caps uppercase font-bold text-on-surface"
                    >
                      <option value="PARENT">{t.roles.PARENT}</option>
                      <option value="MEMBER">{t.roles.MEMBER}</option>
                    </select>
                  ) : (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-label-caps text-[11px] uppercase font-bold tracking-wider ${
                      isMemberOwner
                        ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-300'
                        : member.role === 'PARENT'
                        ? 'bg-primary-fixed/40 text-primary border border-primary/20'
                        : 'bg-surface-container text-secondary border border-surface-container-highest'
                    }`}>
                      {isMemberOwner && <Crown className="w-3.5 h-3.5 text-amber-600" />}
                      <span>{t.roles[member.role]}</span>
                    </span>
                  )}

                  {/* Transfer Ownership / Remove Button */}
                  {isOwner && !isMemberOwner && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleTransfer(member.userId)}
                        title={t.members.transferOwnership}
                        className="p-1.5 rounded-lg text-secondary hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                      >
                        <Crown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemove(member.userId)}
                        title={t.members.removeMember}
                        className="p-1.5 rounded-lg text-secondary hover:text-error hover:bg-error-container/20 transition-colors"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                </div>

              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
