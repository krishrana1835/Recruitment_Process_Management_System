import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/route_protection/AuthContext";
import type { SkillDto } from "@/interfaces/Skill_interrface";
import { notify } from "@/components/custom/Notifications";
import {
  addSkillApi,
  deleteSkillApi,
  getSkills,
  updateSkillApi,
} from "@/api/Skill_api";
import { Atom } from "react-loading-indicators";

export const SkillsManager = () => {
  const [skills, setSkills] = useState<SkillDto[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [editingSkill, setEditingSkill] = useState<SkillDto | null>(null);
  const [editValue, setEditValue] = useState("");

  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    const fetchSkills = async () => {
      if (!user?.token) {
        notify.info("Token expired");
        return;
      }
      setLoading(true);
      try {
        const response = await getSkills();
        setSkills(response);
      } catch (err: any) {
        notify.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, [user]);

  useEffect(() => {}, [skills]);

  const addSkill = async () => {
    if (!newSkill.trim()) return;
    if (!user?.token) {
      notify.error("Token expired");
      return;
    }
    try {
      const response = await addSkillApi(newSkill, user.token);
      setSkills(response);
      notify.success("Skill added successfully");
      setNewSkill("");
    } catch (err: any) {
      notify.error(err.message);
    }
  };

  const deleteSkill = async (id: number) => {
    if (!id) return;
    if (!user?.token) {
      notify.error("Token expired");
      return;
    }
    try {
      await deleteSkillApi(id, user.token);
      setSkills(skills.filter((s) => s.skill_id !== id));
      notify.success("Skill deleted successfully");
    } catch (err: any) {
      notify.error(err.message);
    }
  };

  const startEdit = (skill: SkillDto) => {
    setEditingSkill(skill);
    setEditValue(skill.skill_name);
  };

  const saveEdit = async () => {
    if (!editingSkill) return;
    if (!user?.token) {
      notify.error("Token expired");
      return;
    }
    try {
      const payload = {
        skill_id: editingSkill.skill_id,
        skill_name: editValue,
      };
      const response = await updateSkillApi(payload, user.token);
      setSkills(
        skills.map((s) =>
          s.skill_id === response.skill_id ? { ...s, skill_name: editValue } : s
        )
      );
      setEditingSkill(null);
      setEditValue("");
      notify.success("Skill updated successfully");
    } catch (err: any) {
      notify.error(err.message);
    }
  };

  if (loading) {
    return (
      <Card className="w-full h-full p-4 flex justify-center items-center border-none bg-gray-50">
        <Atom color="#000000" size="medium" text="Loading..." textColor="" />
      </Card>
    );
  }

  return (
    <div className="mx-auto">
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-gray-800 text-xl">Skills</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Add Skill */}
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Add skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
            />
            <Button
              onClick={addSkill}
              className="bg-gray-800 text-white hover:bg-gray-900"
            >
              Add
            </Button>
          </div>

          {/* Skill List */}
          <ul className="space-y-2">
            {skills.map((skill) => (
              <li
                key={skill.skill_id}
                className="flex items-center justify-between border-b border-gray-200 py-2 gap-4"
              >
                {editingSkill?.skill_id === skill.skill_id ? (
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1"
                  />
                ) : (
                  <span className="text-gray-700">{skill.skill_name}</span>
                )}

                <div className="flex gap-2">
                  {editingSkill?.skill_id === skill.skill_id ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={saveEdit}
                      className="text-green-600"
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(skill)}
                      className="text-blue-600"
                    >
                      Edit
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteSkill(skill.skill_id)}
                    className="text-red-600"
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
