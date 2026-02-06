import { useEffect, useState } from 'react';
import { Star, EyeOff, Loader2, User, DollarSign, Clock, Briefcase, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { profileService } from '@/shared/services';
import { useAuth } from '@/shared/hooks/use-auth';
import type { ProviderProfile, Education, Experience, Language, ProfileSkill } from '@/shared/types/profile';
import { ApplicationStatusTag } from '@/shared/components/common/tags';
import { EducationSection } from './EducationSection';
import { ExperienceSection } from './ExperienceSection';
import { LanguageSection } from './LanguageSection';
import { SkillsSection } from './SkillsSection';
import { ClientProfile } from './ClientProfile';
import Button from '@/shared/components/ui/Button';

export default function Profile() {
  const { user } = useAuth();
  
  // Show ClientProfile for clients
  if (user?.role === 'CLIENT') {
    return <ClientProfile />;
  }
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Editable fields
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);
    try {
      const profileData = await profileService.getProfileByUserId(user.id);
      setProfile(profileData);
      setTitle(profileData.title || '');
      setBio(profileData.bio || '');
      setHourlyRate(profileData.hourlyRate?.toString() || '');
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Failed to load profile. You may not have a provider profile yet.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile?.id) return;

    setIsSaving(true);
    try {
      const updated = await profileService.updateProfile(profile.id, {
        title,
        bio,
        hourlyRate: parseFloat(hourlyRate) || undefined,
      });
      setProfile(updated);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error('Failed to update profile:', err);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEducationUpdate = (educations: Education[]) => {
    if (profile) {
      setProfile({ ...profile, education: educations });
    }
  };

  const handleExperienceUpdate = (experiences: Experience[]) => {
    if (profile) {
      setProfile({ ...profile, experiences });
    }
  };

  const handleLanguageUpdate = (languages: Language[]) => {
    if (profile) {
      setProfile({ ...profile, languages });
    }
  };

  const handleSkillUpdate = (skills: ProfileSkill[]) => {
    if (profile) {
      setProfile({ ...profile, skills });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#768de8]" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <div className="text-gray-400 mb-4">
          <User className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Profile Found</h3>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  // No profile state
  if (!profile) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <div className="text-gray-400 mb-4">
          <User className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Provider Profile</h3>
        <p className="text-gray-500">You don't have a provider profile yet.</p>
      </div>
    );
  }

  const fullName = profile.user ? `${profile.user.firstName} ${profile.user.lastName}` : 'Provider';
  const languageNames = profile.languages?.map((l) => l.language).join(', ') || 'Not specified';

  return (
    <>
      {/* Profile Header Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {profile.user?.avatarUrl ? (
                <img
                  src={profile.user.avatarUrl}
                  alt={fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
                <ApplicationStatusTag status={profile.isApproved ? 'APPROVED' : 'PENDING'} />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {profile.title || 'Professional Title Not Set'}
              </p>

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-bold">4.9</span>
                  <span className="ml-1">(<span className="font-bold">0</span> reviews)</span>
                </div>
                <span>|</span>
                <span>{languageNames}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                disabled={isSaving}
                className="bg-[#768de8] hover:bg-[#5a6fd6] text-white border-none"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : isEditing ? (
                  'Save Changes'
                ) : (
                  'Edit Profile'
                )}
              </Button>
              {isEditing && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setTitle(profile.title || '');
                    setBio(profile.bio || '');
                    setHourlyRate(profile.hourlyRate?.toString() || '');
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-900">
            <DollarSign className="w-5 h-5" />
            {profile.hourlyRate || 0}
          </div>
          <div className="text-sm text-gray-500">Hourly Rate</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-900">
            <Briefcase className="w-5 h-5" />
            0
          </div>
          <div className="text-sm text-gray-500">Active Jobs</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-900">
            <DollarSign className="w-5 h-5" />
            0
          </div>
          <div className="text-sm text-gray-500">Earnings (30d)</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-900">
            <CheckCircle className="w-5 h-5" />
            0%
          </div>
          <div className="text-sm text-gray-500">Completion Rate</div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>

        {/* Professional Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Professional Title
          </label>
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Senior Software Engineer | Math Tutor"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#768de8]"
            />
          ) : (
            <p className="text-gray-900">{profile.title || 'Not set'}</p>
          )}
        </div>

        {/* Professional Bio */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Professional Bio
          </label>
          {isEditing ? (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell clients about your experience and expertise..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#768de8] resize-none"
            />
          ) : (
            <p className="text-gray-700 whitespace-pre-wrap">
              {profile.bio || 'No bio provided'}
            </p>
          )}
        </div>

        {/* Hourly Rate */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hourly Rate ($)
          </label>
          {isEditing ? (
            <input
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              placeholder="e.g., 50"
              min="0"
              className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#768de8]"
            />
          ) : (
            <p className="text-gray-900">${profile.hourlyRate || 0}/hr</p>
          )}
        </div>

        <hr className="my-6 text-gray-300" />

        {/* Skills Section */}
        <SkillsSection
          skills={profile.skills || []}
          onUpdate={handleSkillUpdate}
          isEditable={isEditing}
        />

        <hr className="my-6 text-gray-300" />

        {/* Education Section */}
        <EducationSection
          profileId={profile.id}
          educations={profile.education || []}
          onUpdate={handleEducationUpdate}
          isEditable={true}
        />

        <hr className="my-6 text-gray-300" />

        {/* Experience Section */}
        <ExperienceSection
          profileId={profile.id}
          experiences={profile.experiences || []}
          onUpdate={handleExperienceUpdate}
          isEditable={true}
        />

        <hr className="my-6 text-gray-300" />

        {/* Languages Section */}
        <LanguageSection
          languages={profile.languages || []}
          onUpdate={handleLanguageUpdate}
          isEditable={isEditing}
        />
      </div>
    </>
  );
}
